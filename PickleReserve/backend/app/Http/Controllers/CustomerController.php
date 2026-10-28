<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index()
    {
        // Aggregates distinct customers who submitted bookings
        $customers = Booking::select(
            'customer_name as name',
            'customer_email as email',
            'customer_phone as phone',
            DB::raw('COUNT(id) as total_reservations'),
            DB::raw('MIN(created_at) as joined')
        )
            ->groupBy('customer_name', 'customer_email', 'customer_phone')
            ->orderBy('joined', 'desc')
            ->get();

        return response()->json($customers);
    }
}
