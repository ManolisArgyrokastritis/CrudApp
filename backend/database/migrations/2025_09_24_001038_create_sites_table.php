<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sites', function (Blueprint $table) {
        $table->id();
        $table->string('sitename');
        $table->unsignedInteger('sitenumber')->nullable();
        $table->decimal('lat', 10, 6)->nullable();
        $table->decimal('lon', 10, 6)->nullable();
        $table->string('area')->nullable();
        $table->date('installation_date')->nullable();
        $table->timestamps();
    });

    }

    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};
