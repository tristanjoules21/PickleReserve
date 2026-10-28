<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_registration_is_disabled(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Test Player',
            'email' => 'player@example.com',
            'password' => 'secure-password',
        ])->assertForbidden()
            ->assertJsonPath('message', 'Public registration is disabled. Contact your system administrator for an account.');

        $this->assertDatabaseMissing('users', ['email' => 'player@example.com']);
    }

    public function test_admin_login_returns_a_token_for_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'player@example.com',
            'password' => Hash::make('secure-password'),
            'role' => 'ADMIN',
        ]);

        $this->postJson('/api/login', [
            'email' => 'player@example.com',
            'password' => 'secure-password',
        ])->assertOk()
            ->assertJsonPath('user.email', 'player@example.com')
            ->assertJsonStructure(['user', 'token'])
            ->assertJsonMissingPath('user.password');
    }

    public function test_customer_cannot_login_to_the_admin_portal(): void
    {
        User::factory()->create([
            'email' => 'player@example.com',
            'password' => Hash::make('secure-password'),
            'role' => 'CUSTOMER',
        ]);

        $this->postJson('/api/login', [
            'email' => 'player@example.com',
            'password' => 'secure-password',
        ])->assertForbidden()
            ->assertJsonPath('message', 'Only administrator accounts can sign in here.');
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'player@example.com',
            'password' => Hash::make('secure-password'),
            'role' => 'ADMIN',
        ]);

        $this->postJson('/api/login', [
            'email' => 'player@example.com',
            'password' => 'incorrect-password',
        ])->assertUnauthorized()
            ->assertJsonPath('message', 'Invalid credentials');
    }

    public function test_authenticated_user_can_fetch_profile_and_revoke_their_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $this->withToken($token)->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('id', $user->id);

        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $user->id]);
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertUnauthorized();
    }

    public function test_profile_requires_authentication(): void
    {
        $this->getJson('/api/user')->assertUnauthorized();
    }

    public function test_admin_endpoints_require_an_admin_token(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized();
        $this->getJson('/api/bookings')->assertUnauthorized();
        $this->getJson('/api/admin/notifications')->assertUnauthorized();

        $customer = User::factory()->create(['role' => 'CUSTOMER']);
        $customerToken = $customer->createToken('customer-token')->plainTextToken;
        $this->withToken($customerToken)->getJson('/api/dashboard')->assertForbidden();
        $this->withToken($customerToken)->getJson('/api/admin/notifications')->assertForbidden();

        $this->app['auth']->forgetGuards();
        $admin = User::factory()->create(['role' => 'ADMIN']);
        $adminToken = $admin->createToken('admin-token')->plainTextToken;
        $this->withToken($adminToken)->getJson('/api/dashboard')->assertOk();
        $this->withToken($adminToken)->getJson('/api/admin/notifications')->assertOk()->assertExactJson([]);
    }

    public function test_court_browsing_remains_public_but_mutations_require_admin(): void
    {
        $this->getJson('/api/courts')->assertOk();
        $this->postJson('/api/courts', [
            'name' => 'Court 1',
            'price_per_hour' => 350,
        ])->assertUnauthorized();

        $customer = User::factory()->create(['role' => 'CUSTOMER']);
        $this->withToken($customer->createToken('customer-token')->plainTextToken)
            ->postJson('/api/courts', ['name' => 'Court 1', 'price_per_hour' => 350])
            ->assertForbidden();
    }
}
