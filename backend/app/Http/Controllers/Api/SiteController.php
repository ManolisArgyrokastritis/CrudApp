<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Site\SiteImportRequest;
use App\Http\Requests\Site\StoreSiteRequest;
use App\Http\Requests\Site\UpdateSiteRequest;
use App\Http\Resources\SiteResource;
use App\Imports\SitesImport;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class SiteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Site::query();

        if ($search = $request->query('search')) {
            $query->where(function ($builder) use ($search): void {
                $builder->where('sitename', 'like', "%{$search}%")
                    ->orWhere('area', 'like', "%{$search}%")
                    ->orWhere('sitenumber', 'like', "%{$search}%");
            });
        }

        $sortable = ['id', 'sitename', 'sitenumber', 'lat', 'lon', 'area', 'installation_date', 'created_at'];
        $sort = $request->query('sort', 'id');
        if (! in_array($sort, $sortable, true)) {
            $sort = 'id';
        }

        $direction = strtolower($request->query('dir', 'desc')) === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = (int) $request->query('per_page', 10);
        $perPage = max(1, min($perPage, 100));

        $sites = $query->paginate($perPage)->appends($request->query());

        return SiteResource::collection($sites)->response();
    }

    public function store(StoreSiteRequest $request): JsonResponse
    {
        $site = Site::create($request->validated());

        return (new SiteResource($site))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Site $site): JsonResponse
    {
        return (new SiteResource($site))->response();
    }

    public function update(UpdateSiteRequest $request, Site $site): JsonResponse
    {
        $site->update($request->validated());

        return (new SiteResource($site->fresh()))->response();
    }

    public function destroy(Site $site): JsonResponse
    {
        $site->delete();

        return response()->json(null, 204);
    }

    public function import(SiteImportRequest $request): JsonResponse
    {
        $import = new SitesImport();

        Excel::import($import, $request->file('file'));

        $failures = collect($import->failures())->map(function ($failure) {
            return [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values(),
            ];
        })->values();

        return response()->json([
            'message' => 'Import completed',
            'summary' => $import->summary(),
            'failures' => $failures,
        ]);
    }

}
