<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'court_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'start_time',
        'end_time',
        'total_price',
        'payment_method',
        'status',
        'notes',
    ];

    public function court()
    {
        return $this->belongsTo(Court::class);
    }
}
