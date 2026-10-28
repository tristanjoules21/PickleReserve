<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CourtController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/register', [AuthController::class, 'registrationDisabled']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/courts', [CourtController::class, 'index']);
Route::get('/courts/{court}', [CourtController::class, 'show']);
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('courts', CourtController::class)->except(['index', 'show']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/admin/notifications', [BookingController::class, 'notifications']);
    Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus']);

    Route::get('/admin/customers', [CustomerController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

Route::get('/bookings/reserved-slots', [BookingController::class, 'getReservedSlots']);
Route::post('/bookings', [BookingController::class, 'store']);
