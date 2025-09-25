# Λειτουργία Backend & Frontend

## Backend – Κύρια components

- **routes/api.php**: δηλώνει τα endpoints (π.χ. `GET /api/sites`, `POST /api/sites/import`) και τα συνδέει με τον SiteController.
- **app/Http/Controllers/Api/SiteController.php**: κεντρικός controller για CRUD + import. Διαβάζει τα requests, τρέχει validation και μιλάει με το μοντέλο Site.
- **app/Models/Site.php**: Eloquent model που αντιστοιχεί στον πίνακα `sites` της βάσης.
- **app/Http/Requests/Site/StoreSiteRequest.php** & **UpdateSiteRequest.php**: κανόνες validation για δημιουργία/ενημέρωση site.
- **app/Http/Resources/SiteResource.php**: ορίζει ποια πεδία επιστρέφονται στο JSON response.
- **app/Imports/SitesImport.php**: διαβάζει Excel/CSV (μέσω `maatwebsite/excel`), κάνει update/create εγγραφές και δίνει summary.
- **database/migrations/...create_sites_table.php**: ορίζει τη δομή του πίνακα `sites` (στήλες, τύποι, κ.λπ.).
- **config/cors.php**: ρυθμίσεις CORS για να επιτρέπονται αιτήματα από το frontend.

## Frontend – Κύρια components

- **frontend/index.html**: βασικό HTML αρχείο που φορτώνει το React app. Περιέχει το `<div id="root"></div>` όπου γίνεται render η εφαρμογή.
- **frontend/src/main.jsx**: αρχείο εισόδου React· κάνει render το `<App />` μέσα στο `#root` και φορτώνει Bootstrap CSS/JS.
- **frontend/src/App.jsx**: κρατάει όλη τη λογική της σελίδας (state για πίνακα, modals, αναζήτηση, pagination) και καλεί τα API endpoints μέσω Axios.
- **frontend/src/api/client.js**: δημιουργεί Axios instance με base URL το backend (`http://localhost:8000/api`).
- **frontend/src/components/SiteTable.jsx**: εμφανίζει τον πίνακα sites (γραμμές, κεφαλίδες, κουμπιά edit/delete).
- **frontend/src/components/SiteFormModal.jsx**: modal για δημιουργία/επεξεργασία site, χειρίζεται validation errors από το API.
- **frontend/src/components/ImportModal.jsx**: modal για αποστολή Excel, εμφανίζει summary/failures μετά το upload.
- **frontend/src/components/Pagination.jsx**: render των κουμπιών σελιδοποίησης (προηγούμενη/επόμενη σελίδα, αριθμοί).
- **frontend/src/styles.css**: custom CSS (Bootstrap classes + extra styling).

## Ροή λειτουργίας

1. Ο χρήστης ανοίγει το `http://localhost:5173` (React app).
2. Το React (App.jsx) κάνει `GET /api/sites` μέσω του axios client, παίρνει JSON και γεμίζει τον πίνακα.
3. Όταν πατηθεί "Νέα εγγραφή" ή "Επεξεργασία", το SiteFormModal στέλνει `POST` ή `PUT` στο Laravel.
4. Διαγραφή = `DELETE /api/sites/{id}`. Αν επιβεβαιωθεί, ο πίνακας επαναφορτώνεται.
5. "Εισαγωγή Excel" ανοίγει ImportModal, ανεβάζει αρχείο (`POST /api/sites/import`), και η απάντηση δείχνει summary + failures.
6. Όλα τα requests γίνονται μέσω Axios χωρίς page reload και το React ενημερώνει το UI.

Έτσι το backend διαχειρίζεται σωστά αποθήκευση/validation, ενώ το frontend προσφέρει την εμπειρία χρήστη και στέλνει AJAX αιτήματα στο API.
