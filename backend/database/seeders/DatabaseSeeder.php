<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (range(1, 3) as $courtNumber) {
            $court = Court::query()
                ->whereRaw('LOWER(name) = ?', ['court '.$courtNumber])
                ->first();

            if ($court) {
                if ($court->name !== 'Court '.$courtNumber) {
                    $court->update(['name' => 'Court '.$courtNumber]);
                }

                continue;
            }

            Court::create([
                'name' => 'Court '.$courtNumber,
                'description' => 'Silica sand',
                'price_per_hour' => 350,
                'is_active' => true,
            ]);
        }

        if (! User::query()->where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }
    }
}
