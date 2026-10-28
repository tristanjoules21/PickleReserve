<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Court;

class DashboardController extends Controller
{
    public function index()
    {
        $now = now();
        $today = $now->toDateString();
        $peakStart = '17:00:00';
        $peakEnd = '22:00:00';

        $totalReservations = Booking::count();
        $activeCourts = Court::where('is_active', true)->count();
        $courts = Court::query()
            ->orderBy('created_at')
            ->get(['id', 'name', 'is_active']);

        $todayBookings = Booking::whereDate('start_time', $today)
            ->whereIn('status', ['Approved', 'Pending'])
            ->get(['court_id', 'start_time', 'end_time']);

        $dailyCapacity = $activeCourts * 22;
        $capacityPercentage = $dailyCapacity > 0
            ? min(100, (int) round(($todayBookings->count() / $dailyCapacity) * 100))
            : 0;
        $reservedCourtIds = $todayBookings->pluck('court_id')->map(fn ($id) => (int) $id)->all();

        $monthlyBookings = Booking::whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month);
        $monthlyRevenue = (clone $monthlyBookings)->sum('total_price');
        $peakHoursRevenue = (clone $monthlyBookings)
            ->whereTime('start_time', '>=', $peakStart)
            ->whereTime('start_time', '<', $peakEnd)
            ->sum('total_price');

        $previousMonth = $now->copy()->startOfMonth()->subMonth();
        $previousMonthRevenue = Booking::whereYear('created_at', $previousMonth->year)
            ->whereMonth('created_at', $previousMonth->month)
            ->sum('total_price');
        $monthlyRevenueChange = $previousMonthRevenue > 0
            ? round((($monthlyRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100, 1)
            : null;

        $revenueByDay = (clone $monthlyBookings)
            ->selectRaw('DATE(created_at) as revenue_date, SUM(total_price) as revenue')
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->revenue_date,
                'revenue' => (float) $row->revenue,
            ]);

        $recentReservations = Booking::with('court')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'metrics' => [
                'total_reservations' => $totalReservations,
                'active_courts' => $activeCourts,
                'monthly_revenue' => (float) $monthlyRevenue,
                'today_reservations' => $todayBookings->count(),
                'daily_capacity' => $dailyCapacity,
                'capacity_percentage' => $capacityPercentage,
                'total_courts' => $courts->count(),
                'courts' => $courts->map(fn (Court $court) => [
                    'id' => $court->id,
                    'name' => $court->name,
                    'is_active' => $court->is_active,
                    'is_reserved_today' => in_array((int) $court->id, $reservedCourtIds, true),
                ]),
                'monthly_revenue_change' => $monthlyRevenueChange,
                'peak_hours_revenue' => (float) $peakHoursRevenue,
                'off_peak_revenue' => (float) $monthlyRevenue - (float) $peakHoursRevenue,
                'peak_hours_start' => $peakStart,
                'peak_hours_end' => $peakEnd,
                'revenue_by_day' => $revenueByDay,
            ],
            'recent_reservations' => $recentReservations,
        ]);
    }
}
