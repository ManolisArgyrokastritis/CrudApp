<?php

$origins = array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URLS', ''))));
$originPatterns = array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URL_PATTERNS', ''))));

if ($origins === [] && $originPatterns === []) {
    $originPatterns[] = '#^https?://localhost(:\d+)?$#';
}

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $origins,
    'allowed_origins_patterns' => $originPatterns,
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
