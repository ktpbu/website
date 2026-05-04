// Single source of truth for allowed admin emails on the frontend.
// The backend middleware (backend/middleware/adminAuth.js) has its own copy
// and must be kept in sync manually.
export const ALLOWED_ADMIN_EMAILS = [
    "president@ktp-bostonu.com",
    "tech-chair@ktp-bostonu.com",
    "ander010@bu.edu",
    "pharaoh@bu.edu"
];
