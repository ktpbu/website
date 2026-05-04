const ALLOWED_ADMIN_EMAILS = [
    "president@ktp-bostonu.com",
    "tech-chair@ktp-bostonu.com",
    "ander010@bu.edu"
];

// Verifies a Firebase ID token by calling Google's Identity Toolkit REST API
// (no firebase-admin required). Rejects requests whose token is missing,
// invalid, expired, or whose email is not in the allowed admin list.
export async function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const idToken = authHeader.slice(7);
    try {
        const verifyRes = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            }
        );

        if (!verifyRes.ok) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const data = await verifyRes.json();
        const user = data.users?.[0];

        if (!user?.email || !ALLOWED_ADMIN_EMAILS.includes(user.email)) {
            return res.status(403).json({ message: 'Access denied: not an authorized admin' });
        }

        req.admin = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token verification failed' });
    }
}
