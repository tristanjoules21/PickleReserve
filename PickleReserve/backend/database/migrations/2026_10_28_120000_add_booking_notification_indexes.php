<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->index('created_at', 'bookings_created_at_index');
            $table->index(['status', 'created_at'], 'bookings_status_created_at_index');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('bookings_created_at_index');
            $table->dropIndex('bookings_status_created_at_index');
        });
    }
};
