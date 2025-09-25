<?php

namespace Tests\Feature;

use App\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_sites_with_filters(): void
    {
        Site::factory()->create(['sitename' => 'Alpha Hub', 'area' => 'Athens']);
        Site::factory()->create(['sitename' => 'Beta Station', 'area' => 'Thessaloniki']);

        $response = $this->getJson('/api/sites?search=Alpha&sort=sitename&dir=asc&per_page=5');

        $response->assertOk()
            ->assertJsonFragment(['sitename' => 'Alpha Hub'])
            ->assertJsonMissing(['sitename' => 'Beta Station']);
    }

    public function test_it_creates_a_site(): void
    {
        $payload = [
            'sitename' => 'Gamma Node',
            'sitenumber' => 123,
            'lat' => 37.9838,
            'lon' => 23.7275,
            'area' => 'Athens',
            'installation_date' => '2025-09-24',
        ];

        $response = $this->postJson('/api/sites', $payload);

        $response->assertCreated()
            ->assertJsonFragment(['sitename' => 'Gamma Node']);

        $this->assertDatabaseHas('sites', ['sitename' => 'Gamma Node', 'area' => 'Athens']);
    }

    public function test_it_updates_a_site(): void
    {
        $site = Site::factory()->create(['sitename' => 'Delta Site']);

        $response = $this->putJson("/api/sites/{$site->id}", [
            'sitename' => 'Delta Site Updated',
            'area' => 'Patras',
        ]);

        $response->assertOk()
            ->assertJsonFragment(['sitename' => 'Delta Site Updated', 'area' => 'Patras']);

        $this->assertDatabaseHas('sites', ['id' => $site->id, 'sitename' => 'Delta Site Updated', 'area' => 'Patras']);
    }

    public function test_it_deletes_a_site(): void
    {
        $site = Site::factory()->create();

        $response = $this->deleteJson("/api/sites/{$site->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('sites', ['id' => $site->id]);
    }
}
