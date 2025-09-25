import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import client from './api/client';
import SiteTable from './components/SiteTable.jsx';
import SiteFormModal from './components/SiteFormModal.jsx';
import Pagination from './components/Pagination.jsx';
import ImportModal from './components/ImportModal.jsx';

const DEFAULT_QUERY = {
  page: 1,
  perPage: 10,
  sort: 'id',
  dir: 'desc',
  search: '',
};

function App() {
  const [sites, setSites] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [searchInput, setSearchInput] = useState('');

  const [formState, setFormState] = useState({
    open: false,
    mode: 'create',
    site: null,
    errors: {},
    saving: false,
  });

  const [importState, setImportState] = useState({
    open: false,
    submitting: false,
    summary: null,
    failures: [],
    error: null,
  });

  const fetchIdRef = useRef(0);

  const fetchSites = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await client.get('/sites', {
        params: {
          page: query.page,
          per_page: query.perPage,
          sort: query.sort,
          dir: query.dir,
          search: query.search || undefined,
        },
      });

      if (fetchId === fetchIdRef.current) {
        setSites(response.data.data ?? []);
        setMeta(response.data.meta ?? null);
      }
    } catch (response) {
      if (fetchId === fetchIdRef.current) {
        if (response?.name === 'CanceledError') {
          return;
        }

        setError(response.data?.message ?? 'Αποτυχία φόρτωσης των sites.');
      }
    } finally {
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [query]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery((current) => {
        if (current.search === searchInput) {
          return current;
        }

        return { ...current, page: 1, search: searchInput };
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleSortChange = (field) => {
    setQuery((current) => {
      const isSameField = current.sort === field;
      const nextDir = isSameField && current.dir === 'asc' ? 'desc' : 'asc';
      return { ...current, sort: field, dir: nextDir, page: 1 };
    });
  };

  const handlePageChange = (page) => {
    setQuery((current) => ({ ...current, page }));
  };

  const handlePerPageChange = (event) => {
    const perPage = Number(event.target.value);
    setQuery((current) => ({ ...current, perPage, page: 1 }));
  };

  const openCreateModal = () => {
    setFormState({ open: true, mode: 'create', site: null, errors: {}, saving: false });
  };

  const openEditModal = (site) => {
    setFormState({ open: true, mode: 'edit', site, errors: {}, saving: false });
  };

  const closeFormModal = () => {
    setFormState((current) => ({ ...current, open: false, errors: {}, saving: false }));
  };

  const submitForm = async (payload) => {
    setFormState((current) => ({ ...current, saving: true, errors: {} }));

    try {
      if (formState.mode === 'create') {
        await client.post('/sites', payload);
        setNotice('Το site δημιουργήθηκε με επιτυχία.');
        setQuery((current) => ({ ...current, page: 1 }));
      } else if (formState.site) {
        await client.put(`/sites/${formState.site.id}`, payload);
        setNotice('Οι αλλαγές αποθηκεύτηκαν.');
      }

      closeFormModal();
      await fetchSites();
    } catch (response) {
      if (response.status === 422) {
        setFormState((current) => ({ ...current, errors: response.data?.errors ?? {}, saving: false }));
        return;
      }

      setError(response.data?.message ?? 'Αποτυχία αποθήκευσης των αλλαγών.');
      setFormState((current) => ({ ...current, saving: false }));
    }
  };

  const handleDelete = async (site) => {
    if (!window.confirm(`Να διαγραφεί ο χώρος «${site.sitename}»;`)) {
      return;
    }

    try {
      await client.delete(`/sites/${site.id}`);
      setNotice('Το site διαγράφηκε.');
      await fetchSites();
    } catch (response) {
      setError(response.data?.message ?? 'Αποτυχία διαγραφής.');
    }
  };

  const openImportModal = () => {
    setImportState({ open: true, submitting: false, summary: null, failures: [], error: null });
  };

  const closeImportModal = () => {
    setImportState({ open: false, submitting: false, summary: null, failures: [], error: null });
  };

  const submitImport = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setImportState((current) => ({ ...current, submitting: true, error: null }));

    try {
      const response = await client.post('/sites/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImportState((current) => ({
        ...current,
        submitting: false,
        summary: response.data?.summary ?? null,
        failures: response.data?.failures ?? [],
      }));
      setNotice(response.data?.message ?? 'Η εισαγωγή ολοκληρώθηκε.');
      await fetchSites();
    } catch (response) {
      if (response.status === 422) {
        setImportState((current) => ({
          ...current,
          submitting: false,
          error: 'Το αρχείο δεν έγινε δεκτό. Ελέγξτε τη μορφή και τα δεδομένα.',
        }));
        return;
      }

      setImportState((current) => ({
        ...current,
        submitting: false,
        error: response.data?.message ?? 'Αποτυχία εισαγωγής.',
      }));
    }
  };

  const perPageOptions = useMemo(() => [10, 25, 50, 100], []);

  return (
    <div className="container my-4">
      <header className="header-section">
        <h2 id="main_title">Manos Argyrokastritis</h2>
        <h1>CRUD Dashboard</h1>
      </header>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 action-section mb-3">
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary btn-modern" onClick={openCreateModal}>
            <i className="bi bi-plus-circle me-2" />Νέα εγγραφή
          </button>
          <button type="button" className="btn btn-success btn-modern" onClick={openImportModal}>
            <i className="bi bi-upload me-2" />Εισαγωγή Excel
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="input-group search-container">
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Αναζήτηση..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <select className="form-select" style={{ maxWidth: '120px' }} value={query.perPage} onChange={handlePerPageChange}>
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option} / σελίδα
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger modern-alert" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {error}
        </div>
      )}

      {notice && (
        <div className="alert alert-success modern-alert d-flex justify-content-between align-items-center" role="alert">
          <span>
            <i className="bi bi-check-circle-fill me-2" />
            {notice}
          </span>
          <button type="button" className="btn btn-sm btn-light" onClick={() => setNotice(null)}>
            Κλείσιμο
          </button>
        </div>
      )}

      <div className="table-wrapper position-relative">
        {loading && (
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <SiteTable
          sites={sites}
          sort={query.sort}
          dir={query.dir}
          onSortChange={handleSortChange}
          onEdit={openEditModal}
          onDelete={handleDelete}
          disabled={loading}
        />
      </div>

      <Pagination meta={meta} onChange={handlePageChange} disabled={loading} />

      <SiteFormModal
        open={formState.open}
        mode={formState.mode}
        site={formState.site}
        errors={formState.errors}
        saving={formState.saving}
        onClose={closeFormModal}
        onSubmit={submitForm}
      />

      <ImportModal
        open={importState.open}
        submitting={importState.submitting}
        summary={importState.summary}
        failures={importState.failures}
        error={importState.error}
        onClose={closeImportModal}
        onSubmit={submitImport}
      />
    </div>
  );
}

export default App;
