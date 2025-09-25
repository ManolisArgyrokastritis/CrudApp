<?php

use App\Http\Controllers\Api\SiteController;
use Illuminate\Support\Facades\Route;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;


RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(120)->by((string) ($request->user()?->id ?: $request->ip()));
});

Route::middleware('api')->group(function () {
    Route::post('/sites/import', [SiteController::class, 'import'])->name('api.sites.import');
    Route::apiResource('sites', SiteController::class)->except(['create', 'edit']);
});
