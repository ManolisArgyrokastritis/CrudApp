<?php

namespace App\Http\Requests\Site;

class UpdateSiteRequest extends StoreSiteRequest
{
    public function rules(): array
    {
        return [
            'sitename' => ['sometimes', 'required', 'string', 'max:25'],
            'sitenumber' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'lat' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'lon' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'area' => ['sometimes', 'nullable', 'string', 'max:255'],
            'installation_date' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
