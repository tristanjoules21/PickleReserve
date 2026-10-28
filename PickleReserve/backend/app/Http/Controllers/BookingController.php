<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Court;
use DateTimeImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    // Fetch all bookings for Admin Reservations View
    public function index(): JsonResponse
    {
        $bookings = Booking::with('court')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function notifications(): JsonResponse
    {
        $bookings = Booking::with('court:id,name')
            ->where('status', 'Pending')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get([
                'id',
                'court_id',
                'customer_name',
                'start_time',
                'created_at',
                'status',
            ]);

        return response()->json($bookings);
    }

    // Fetch approved & pending reserved slots for a specific date
    public function getReservedSlots(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date_format:Y-m-d',
        ]);

        $date = $request->query('date');

        $reservedSlots = Booking::whereDate('start_time', $date)
            ->whereIn('status', ['Approved', 'Pending'])
            ->get(['id', 'court_id', 'start_time', 'end_time', 'status']);

        return response()->json($reservedSlots);
    }

    // Submit reservation request from Customer Booking Page
    public function store(Request $request): JsonResponse
    {
        if ($request->has('bookings')) {
            return $this->storeMultiple($request);
        }

        $validated = $request->validate([
            'court_id' => 'required|exists:courts,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'total_price' => 'required|numeric',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Explicitly attach status to ensure visibility in admin panel
        $validated['status'] = $validated['status'] ?? 'Pending';

        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'Reservation request submitted successfully!',
            'booking' => $booking->load('court'),
        ], 201);
    }

    private function storeMultiple(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
            'bookings' => 'required|array|min:1',
            'bookings.*.court_id' => 'required|exists:courts,id',
            'bookings.*.start_time' => 'required|date',
            'bookings.*.end_time' => 'required|date|after:bookings.*.start_time',
        ]);

        $bookings = DB::transaction(function () use ($validated) {
            return collect($validated['bookings'])->map(function (array $details) use ($validated): Booking {
                $court = Court::findOrFail($details['court_id']);
                $startTime = new DateTimeImmutable($details['start_time']);
                $endTime = new DateTimeImmutable($details['end_time']);
                $durationHours = ($endTime->getTimestamp() - $startTime->getTimestamp()) / 3600;

                return Booking::create([
                    'court_id' => $court->id,
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'start_time' => $details['start_time'],
                    'end_time' => $details['end_time'],
                    'total_price' => round((float) $court->price_per_hour * $durationHours, 2),
                    'payment_method' => $validated['payment_method'],
                    'status' => 'Pending',
                    'notes' => $validated['notes'] ?? null,
                ]);
            });
        });

        $bookings->each(function (Booking $booking): void {
            $booking->load('court');
        });

        return response()->json([
            'message' => 'Reservation request submitted successfully!',
            'bookings' => $bookings,
        ], 201);
    }

    // Approve / Reject Reservation Status
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Approved,Rejected,Pending',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $validated['status']]);

        return response()->json($booking->load('court'));
    }
}
