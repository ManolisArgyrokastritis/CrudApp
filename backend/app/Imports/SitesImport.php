<?php

namespace App\Imports;

use App\Models\Site;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class SitesImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    public int $processed = 0;
    public int $created = 0;
    public int $updated = 0;

    public function model(array $row)
    {
        $name = trim((string) ($row['sitename'] ?? ''));

        if ($name === '') {
            return null;
        }

        $this->processed++;

        $date = null;
        if (! empty($row['installation_date'])) {
            $raw = $row['installation_date'];
            $date = is_numeric($raw)
                ? Carbon::instance(ExcelDate::excelToDateTimeObject($raw))->toDateString()
                : Carbon::parse((string) $raw)->toDateString();
        }

        $attributes = [
            'sitenumber' => isset($row['sitenumber']) ? (int) $row['sitenumber'] : null,
            'lat' => isset($row['lat']) ? (float) $row['lat'] : null,
            'lon' => isset($row['lon']) ? (float) $row['lon'] : null,
            'area' => Arr::get($row, 'area'),
            'installation_date' => $date,
        ];

        $site = Site::updateOrCreate(
            ['sitename' => $name],
            $attributes,
        );

        if ($site->wasRecentlyCreated) {
            $this->created++;
        } else {
            $this->updated++;
        }

        return null;
    }

    public function rules(): array
    {
        return [
            '*.sitename' => ['required', 'string', 'max:255'],
            '*.sitenumber' => ['nullable', 'integer', 'min:0'],
            '*.lat' => ['nullable', 'numeric', 'between:-90,90'],
            '*.lon' => ['nullable', 'numeric', 'between:-180,180'],
            '*.area' => ['nullable', 'string', 'max:255'],
            '*.installation_date' => ['nullable'],
        ];
    }

    public function summary(): array
    {
        return [
            'processed' => $this->processed,
            'created' => $this->created,
            'updated' => $this->updated,
            'skipped' => count($this->failures()),
        ];
    }
}
