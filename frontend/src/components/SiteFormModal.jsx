import { useEffect, useMemo, useState } from 'react';

const EMPTY_FORM = {
  sitename: '',
  sitenumber: '',
  lat: '',
  lon: '',
  area: '',
  installation_date: '',
};

const sanitizePayload = (values) => ({
  sitename: values.sitename.trim(),
  sitenumber: values.sitenumber === '' ? null : values.sitenumber.trim(),
  lat: values.lat === '' ? null : values.lat.trim(),
  lon: values.lon === '' ? null : values.lon.trim(),
  area: values.area.trim() || null,
  installation_date: values.installation_date || null,
});

const fieldError = (errors, key) => {
  if (!errors || !errors[key]) {
    return null;
  }

  return errors[key].join(' ');
};

function SiteFormModal({ open, mode, site, errors, saving, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setValues({
        sitename: site?.sitename ?? '',
        sitenumber: site?.sitenumber !== undefined && site?.sitenumber !== null ? String(site.sitenumber) : '',
        lat: site?.lat !== undefined && site?.lat !== null ? String(site.lat) : '',
        lon: site?.lon !== undefined && site?.lon !== null ? String(site.lon) : '',
        area: site?.area ?? '',
        installation_date: site?.installation_date ?? '',
      });
    } else {
      setValues(EMPTY_FORM);
    }
  }, [open, site]);

  const title = useMemo(() => (mode === 'edit' ? 'Επεξεργασία Site' : 'Νέο Site'), [mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit?.(sanitizePayload(values));
  };

  if (!open) {
    return null;
  }

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content modern-modal">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>

          <form onSubmit={submit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="sitename">Sitename</label>
                  <input
                    id="sitename"
                    name="sitename"
                    type="text"
                    className={`form-control modern-input ${fieldError(errors, 'sitename') ? 'is-invalid' : ''}`}
                    value={values.sitename}
                    onChange={handleChange}
                    required
                  />
                  {fieldError(errors, 'sitename') && (
                    <div className="invalid-feedback">{fieldError(errors, 'sitename')}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="sitenumber">Sitenumber</label>
                  <input
                    id="sitenumber"
                    name="sitenumber"
                    type="number"
                    className={`form-control modern-input ${fieldError(errors, 'sitenumber') ? 'is-invalid' : ''}`}
                    value={values.sitenumber}
                    onChange={handleChange}
                  />
                  {fieldError(errors, 'sitenumber') && (
                    <div className="invalid-feedback">{fieldError(errors, 'sitenumber')}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="lat">Latitude</label>
                  <input
                    id="lat"
                    name="lat"
                    type="number"
                    step="0.000001"
                    className={`form-control modern-input ${fieldError(errors, 'lat') ? 'is-invalid' : ''}`}
                    value={values.lat}
                    onChange={handleChange}
                  />
                  {fieldError(errors, 'lat') && (
                    <div className="invalid-feedback">{fieldError(errors, 'lat')}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="lon">Longitude</label>
                  <input
                    id="lon"
                    name="lon"
                    type="number"
                    step="0.000001"
                    className={`form-control modern-input ${fieldError(errors, 'lon') ? 'is-invalid' : ''}`}
                    value={values.lon}
                    onChange={handleChange}
                  />
                  {fieldError(errors, 'lon') && (
                    <div className="invalid-feedback">{fieldError(errors, 'lon')}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="area">Area</label>
                  <input
                    id="area"
                    name="area"
                    type="text"
                    className={`form-control modern-input ${fieldError(errors, 'area') ? 'is-invalid' : ''}`}
                    value={values.area}
                    onChange={handleChange}
                  />
                  {fieldError(errors, 'area') && (
                    <div className="invalid-feedback">{fieldError(errors, 'area')}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="installation_date">Installation Date</label>
                  <input
                    id="installation_date"
                    name="installation_date"
                    type="date"
                    className={`form-control modern-input ${fieldError(errors, 'installation_date') ? 'is-invalid' : ''}`}
                    value={values.installation_date ?? ''}
                    onChange={handleChange}
                  />
                  {fieldError(errors, 'installation_date') && (
                    <div className="invalid-feedback">{fieldError(errors, 'installation_date')}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-modern" onClick={onClose} disabled={saving}>
                Ακύρωση
              </button>
              <button type="submit" className="btn btn-primary btn-modern" disabled={saving}>
                {saving ? (
                  <span className="d-inline-flex align-items-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Αποθήκευση...
                  </span>
                ) : (
                  'Αποθήκευση'
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

export default SiteFormModal;
