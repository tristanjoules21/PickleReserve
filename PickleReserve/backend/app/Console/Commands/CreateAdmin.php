<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdmin extends Command
{
    protected $signature = 'app:create-admin {name} {email}';

    protected $description = 'Create an administrator account from the server console';

    public function handle(): int
    {
        $name = trim((string) $this->argument('name'));
        $email = trim((string) $this->argument('email'));

        $validator = Validator::make(
            ['name' => $name, 'email' => $email],
            ['name' => 'required|string|max:255', 'email' => 'required|email|max:255|unique:users,email']
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $password = $this->secret('Password (minimum 8 characters)');
        $confirmation = $this->secret('Confirm password');

        if (! is_string($password) || strlen($password) < 8) {
            $this->error('Password must be at least 8 characters.');

            return self::FAILURE;
        }

        if (! is_string($confirmation) || ! hash_equals($password, $confirmation)) {
            $this->error('Password confirmation does not match.');

            return self::FAILURE;
        }

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => 'ADMIN',
        ]);

        $this->info("Administrator account created for {$email}.");

        return self::SUCCESS;
    }
}
