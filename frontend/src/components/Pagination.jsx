function Pagination({ meta, onChange, disabled }) {
  if (!meta || meta.last_page <= 1) {
    return null;
  }

  const pages = Array.from({ length: meta.last_page }, (_, index) => index + 1);
  const canGoPrev = meta.current_page > 1;
  const canGoNext = meta.current_page < meta.last_page;

  const handlePageClick = (page) => {
    if (page === meta.current_page || disabled) {
      return;
    }

    onChange?.(page);
  };

  const from = meta.from ?? 0;
  const to = meta.to ?? 0;
  const total = meta.total ?? 0;

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3">
      <div className="text-muted small">
        Προβολή {from} - {to} από {total}
      </div>

      <nav aria-label="Site pagination" className="pagination-wrapper">
        <ul className="pagination mb-0">
          <li className={`page-item ${!canGoPrev || disabled ? 'disabled' : ''}`}>
            <button
              className="page-link"
              type="button"
              onClick={() => handlePageClick(meta.current_page - 1)}
              disabled={!canGoPrev || disabled}
            >
              «
            </button>
          </li>

          {pages.map((page) => (
            <li key={page} className={`page-item ${page === meta.current_page ? 'active' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => handlePageClick(page)}
                disabled={disabled}
              >
                {page}
              </button>
            </li>
          ))}

          <li className={`page-item ${!canGoNext || disabled ? 'disabled' : ''}`}>
            <button
              className="page-link"
              type="button"
              onClick={() => handlePageClick(meta.current_page + 1)}
              disabled={!canGoNext || disabled}
            >
              »
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
