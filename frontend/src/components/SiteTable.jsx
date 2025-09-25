const HEADERS = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'sitename', label: 'Sitename', sortable: true },
  { key: 'sitenumber', label: 'Sitenumber', sortable: true },
  { key: 'lat', label: 'Lat', sortable: true },
  { key: 'lon', label: 'Lon', sortable: true },
  { key: 'area', label: 'Area', sortable: true },
  { key: 'installation_date', label: 'Installation Date', sortable: true },
  { key: 'created_at', label: 'Created', sortable: true },
  { key: 'actions', label: '', sortable: false },
];

const formatNumber = (value) => {
  if (value === null || value === undefined) {
    return '—';
  }

  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 6 });
};

const truncate = (value, max = 15) => {
  if (value === null || value === undefined) {
    return '—';
  }

  const text = String(value);
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

function SortIcon({ active, direction }) {
  if (!active) {
    return <i className="bi bi-arrow-down-up ms-1 text-muted" aria-hidden="true" />;
  }

  return direction === 'asc' ? (
    <i className="bi bi-arrow-up ms-1" aria-hidden="true" />
  ) : (
    <i className="bi bi-arrow-down ms-1" aria-hidden="true" />
  );
}

function SiteTable({ sites, sort, dir, onSortChange, onEdit, onDelete, disabled }) {
  const handleHeaderClick = (header) => {
    if (!header.sortable || disabled) {
      return;
    }

    onSortChange?.(header.key);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered table-striped modern-table" id="sitesTable">
        <thead>
          <tr>
            {HEADERS.map((header) => {
              const isActive = sort === header.key;

              return (
                <th
                  key={header.key}
                  scope="col"
                  onClick={() => handleHeaderClick(header)}
                  style={{ cursor: header.sortable ? 'pointer' : 'default' }}
                >
                  <span className="d-inline-flex align-items-center">
                    {header.label}
                    {header.sortable && <SortIcon active={isActive} direction={dir} />}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody id="tableBody">
          {sites.length === 0 && (
            <tr>
              <td colSpan={HEADERS.length} className="text-center py-4 text-muted">
                Δεν βρέθηκαν εγγραφές.
              </td>
            </tr>
          )}

          {sites.map((site) => (
            <tr key={site.id}>
              <td>{site.id}</td>
              <td>{site.sitename}</td>
              <td><span title={site.sitenumber ?? ''}>{truncate(site.sitenumber)}</span></td>
              <td>{formatNumber(site.lat)}</td>
              <td>{formatNumber(site.lon)}</td>
              <td>{site.area ?? '—'}</td>
              <td>{formatDate(site.installation_date)}</td>
              <td>{formatDate(site.created_at)}</td>
              <td className="text-nowrap">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-modern me-2"
                  onClick={() => onEdit?.(site)}
                  disabled={disabled}
                >
                  <i className="bi bi-pencil-square me-1" />Επεξεργασία
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger btn-modern"
                  onClick={() => onDelete?.(site)}
                  disabled={disabled}
                >
                  <i className="bi bi-trash me-1" />Διαγραφή
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SiteTable;
