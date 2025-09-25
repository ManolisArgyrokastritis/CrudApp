<?php

namespace App\Http\Requests\Site;

use Illuminate\Foundation\Http\FormRequest;

class StoreSiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sitename' => ['required', 'string', 'max:15'],
            'sitenumber' => ['nullable', 'integer', 'min:0'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lon' => ['nullable', 'numeric', 'between:-180,180'],
            'area' => ['nullable', 'string', 'max:255'],
            'installation_date' => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('sitename') && is_string($this->sitename)) {
            $this->merge(['sitename' => trim($this->sitename)]);
        }

        if ($this->has('area')) {
            $area = $this->area;

            if (is_string($area)) {
                $area = trim($area);
            }

            $this->merge(['area' => $area === '' ? null : $area]);
        }

        foreach (['sitenumber', 'lat', 'lon'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $this->merge([$field => trim($this->input($field))]);
            }
        }
    }
}
