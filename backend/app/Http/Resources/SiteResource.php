<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Site */
class SiteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sitename' => $this->sitename,
            'sitenumber' => $this->sitenumber,
            'lat' => $this->lat !== null ? (float) $this->lat : null,
            'lon' => $this->lon !== null ? (float) $this->lon : null,
            'area' => $this->area,
            'installation_date' => optional($this->installation_date)->toDateString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
