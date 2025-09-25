<?php

namespace Database\Factories;

use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Site>
 */
class SiteFactory extends Factory
{
    protected $model = Site::class;

    public function definition(): array
    {
        return [
            'sitename' => $this->faker->unique()->company(),
            'sitenumber' => $this->faker->numberBetween(1, 99999),
            'lat' => $this->faker->latitude(),
            'lon' => $this->faker->longitude(),
            'area' => $this->faker->city(),
            'installation_date' => $this->faker->date(),
        ];
    }
}
