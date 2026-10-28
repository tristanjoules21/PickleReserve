<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (! Schema::hasColumn('bookings', 'court_id')) {
                $table->foreignId('court_id')->nullable()->after('id')->constrained('courts')->onDelete('cascade');
            }
            if (! Schema::hasColumn('bookings', 'customer_name')) {
                $table->string('customer_name')->nullable();
            }
            if (! Schema::hasColumn('bookings', 'customer_email')) {
                $table->string('customer_email')->nullable();
            }
            if (! Schema::hasColumn('bookings', 'customer_phone')) {
                $table->string('customer_phone')->nullable();
            }
            if (! Schema::hasColumn('bookings', 'payment_method')) {
                $table->string('payment_method')->default('Pay at venue');
            }
            if (! Schema::hasColumn('bookings', 'notes')) {
                $table->text('notes')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'court_id',
                'customer_name',
                'customer_email',
                'customer_phone',
                'payment_method',
                'notes',
            ]);
        });
    }
};
