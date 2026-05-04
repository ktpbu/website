import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { Navigate } from 'react-router-dom';
import { ALLOWED_ADMIN_EMAILS } from '../../constants/adminEmails';

// Wraps any admin page. Redirects unauthenticated or unauthorised users to
// /admin (the login page) rather than rendering the protected content.
export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.email && ALLOWED_ADMIN_EMAILS.includes(user.email)) {
                setStatus('authorized');
            } else {
                setStatus('unauthorized');
            }
        });
        return unsubscribe;
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen bg-[rgb(248,247,252)]">
                <p className="text-gray-500">Verifying access…</p>
            </div>
        );
    }

    if (status === 'unauthorized') {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
}
