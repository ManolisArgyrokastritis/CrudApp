import { useEffect, useState } from 'react';

function ImportModal({ open, submitting, summary, failures, error, onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setLocalError(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!file) {
      setLocalError('Επιλέξτε ένα αρχείο Excel (xlsx, xls, csv).');
      return;
    }

    onSubmit?.(file);
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setLocalError(null);
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content modern-modal">
          <div className="modal-header">
            <h5 className="modal-title">Εισαγωγή από Excel</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="importFile" className="form-label">Αρχείο</label>
                <input
                  id="importFile"
                  name="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="form-control"
                  onChange={handleFileChange}
                  disabled={submitting}
                  required
                />
                {(localError || error) && (
                  <div className="text-danger small mt-2">{localError || error}</div>
                )}
              </div>

              {summary && (
                <div className="alert alert-info">
                  <strong>Αποτελέσματα εισαγωγής</strong>
                  <ul className="mb-0 mt-2">
                    <li>Σύνολο γραμμών: {summary.processed}</li>
                    <li>Νέες εγγραφές: {summary.created}</li>
                    <li>Ενημερώσεις: {summary.updated}</li>
                    <li>Παραλείψεις: {summary.skipped}</li>
                  </ul>
                </div>
              )}

              {failures && failures.length > 0 && (
                <div className="alert alert-warning">
                  <strong>Σφάλματα</strong>
                  <ul className="mb-0 mt-2">
                    {failures.slice(0, 5).map((failure) => (
                      <li key={`${failure.row}-${failure.attribute}`}>
                        Γραμμή {failure.row}: {failure.errors?.join(', ')}
                      </li>
                    ))}
                    {failures.length > 5 && <li>...και άλλα {failures.length - 5} σφάλματα.</li>}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-modern" onClick={onClose} disabled={submitting}>
                Κλείσιμο
              </button>
              <button type="submit" className="btn btn-success btn-modern" disabled={submitting}>
                {submitting ? (
                  <span className="d-inline-flex align-items-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Μεταφόρτωση...
                  </span>
                ) : (
                  'Μεταφόρτωση'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </div>
  );
}

export default ImportModal;
