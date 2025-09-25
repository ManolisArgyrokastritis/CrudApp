<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'sitenumber' => 'integer',
        'lat' => 'decimal:6',
        'lon' => 'decimal:6',
        'installation_date' => 'date:Y-m-d',
    ];
}
