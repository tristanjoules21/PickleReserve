<?php

namespace Tests\Feature;

use App\Models\Court;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BookingPersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_notifications_return_only_recent_pending_bookings(): void
    {
        $court = Court::create([
            'name' => 'Court 1',
            'price_per_hour' => 350,
            'is_active' => true,
        ]);
        $pending = Booking::create([
            'court_id' => $court->id,
            'customer_name' => 'New Player',
            'customer_email' => 'new@example.com',
            'customer_phone' => '09123456789',
            'start_time' => '2026-10-20 06:00:00',
            'end_time' => '2026-10-20 07:00:00',
            'total_price' => 350,
            'payment_method' => 'GCash',
            'status' => 'Pending',
        ]);
        Booking::create([
            'court_id' => $court->id,
            'customer_name' => 'Approved Player',
            'customer_email' => 'approved@example.com',
            'customer_phone' => '09123456789',
            'start_time' => '2026-10-20 07:00:00',
            'end_time' => '2026-10-20 08:00:00',
            'total_price' => 350,
            'payment_method' => 'GCash',
            'status' => 'Approved',
        ]);

        $this->withToken($this->adminToken())
            ->getJson('/api/admin/notifications')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $pending->id)
            ->assertJsonPath('0.customer_name', 'New Player')
            ->assertJsonPath('0.court.name', 'Court 1');
    }

    public function test_multiple_booking_slots_are_saved_and_returned_by_the_dashboard(): void
    {
        $court = Court::create([
            'name' => 'Court 1',
            'price_per_hour' => 350,
            'is_active' => true,
        ]);

        $this->postJson('/api/bookings', [
            'customer_name' => 'Test Player',
            'customer_email' => 'player@example.com',
            'customer_phone' => '09123456789',
            'payment_method' => 'GCash',
            'bookings' => [
                [
                    'court_id' => $court->id,
                    'start_time' => '2026-10-20 06:00:00',
                    'end_time' => '2026-10-20 07:00:00',
                ],
                [
                    'court_id' => $court->id,
                    'start_time' => '2026-10-20 07:00:00',
                    'end_time' => '2026-10-20 08:00:00',
                ],
            ],
        ])
            ->assertCreated()
            ->assertJsonCount(2, 'bookings')
            ->assertJsonPath('bookings.0.total_price', 350);

        $this->assertDatabaseCount('bookings', 2);

        $this->withToken($this->adminToken())->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('metrics.total_reservations', 2)
            ->assertJsonPath('recent_reservations.0.customer_name', 'Test Player')
            ->assertJsonPath('recent_reservations.0.court.name', 'Court 1');
    }

    public function test_dashboard_returns_live_capacity_court_and_revenue_breakdowns(): void
    {
        $court = Court::create([
            'name' => 'Court 1',
            'price_per_hour' => 350,
            'is_active' => true,
        ]);

        Carbon::setTestNow(Carbon::parse('2026-10-20 12:00:00'));
        DB::table('bookings')->insert([
            'court_id' => $court->id,
            'customer_name' => 'Previous Month Player',
            'customer_email' => 'previous@example.com',
            'customer_phone' => '09123456789',
            'start_time' => '2026-09-15 18:00:00',
            'end_time' => '2026-09-15 19:00:00',
            'total_price' => 350,
            'payment_method' => 'Pay at venue',
            'status' => 'Approved',
            'created_at' => '2026-09-15 12:00:00',
            'updated_at' => '2026-09-15 12:00:00',
        ]);
        DB::table('bookings')->insert([
            [
                'court_id' => $court->id,
                'customer_name' => 'Test Player',
                'customer_email' => 'player@example.com',
                'customer_phone' => '09123456789',
                'start_time' => '2026-10-20 06:00:00',
                'end_time' => '2026-10-20 07:00:00',
                'total_price' => 350,
                'payment_method' => 'GCash',
                'status' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'court_id' => $court->id,
                'customer_name' => 'Test Player',
                'customer_email' => 'player@example.com',
                'customer_phone' => '09123456789',
                'start_time' => '2026-10-20 07:00:00',
                'end_time' => '2026-10-20 08:00:00',
                'total_price' => 350,
                'payment_method' => 'GCash',
                'status' => 'Approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'court_id' => $court->id,
                'customer_name' => 'Test Player',
                'customer_email' => 'player@example.com',
                'customer_phone' => '09123456789',
                'start_time' => '2026-10-20 18:00:00',
                'end_time' => '2026-10-20 19:00:00',
                'total_price' => 350,
                'payment_method' => 'GCash',
                'status' => 'Rejected',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->withToken($this->adminToken())->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('metrics.total_reservations', 4)
            ->assertJsonPath('metrics.active_courts', 1)
            ->assertJsonPath('metrics.today_reservations', 2)
            ->assertJsonPath('metrics.daily_capacity', 22)
            ->assertJsonPath('metrics.capacity_percentage', 9)
            ->assertJsonPath('metrics.total_courts', 1)
            ->assertJsonPath('metrics.courts.0.is_reserved_today', true)
            ->assertJsonPath('metrics.monthly_revenue', 1050)
            ->assertJsonPath('metrics.monthly_revenue_change', 200)
            ->assertJsonPath('metrics.peak_hours_revenue', 350)
            ->assertJsonPath('metrics.off_peak_revenue', 700)
            ->assertJsonPath('metrics.revenue_by_day.0.date', '2026-10-20')
            ->assertJsonPath('metrics.revenue_by_day.0.revenue', 1050);

        Carbon::setTestNow();
    }

    private function adminToken(): string
    {
        return User::factory()
            ->create(['role' => 'ADMIN'])
            ->createToken('booking-test-admin')
            ->plainTextToken;
    }
}
