<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Sites REST API is running.',
        'docs' => 'Refer to AGENTS.md or README for usage.',
    ]);
});
