import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'features/Auth/AuthContext';
import { isUserOnboarded } from 'pages/api/user';

interface RouteProps {
    children: JSX.Element;
}

const Route = ({ children }: RouteProps) => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const routerPath = router.pathname;

    useEffect(() => {
        if (!isAuthenticated() || user == null || router.pathname.endsWith('/register/details'))
            return;

        isUserOnboarded(user.uid)
            .then(async (isOnboarded) => {
                if (!isOnboarded) await router.push('/register/details');
            })
            .catch((err) => {
                Sentry.captureException(err);
                console.error(err);
            });
    }, [user, isAuthenticated, routerPath, router]);

    return children;
};

export default Route;
