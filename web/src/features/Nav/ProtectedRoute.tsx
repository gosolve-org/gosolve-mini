import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from 'features/Auth/AuthContext';
import { PROTECTED_ROUTES } from 'features/Nav/protectedRoutes';
import Loader from 'common/components/layout/Loader';
import Route from './Route';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const routerPath = router.pathname;

    useEffect(() => {
        if (!isAuthenticated() && PROTECTED_ROUTES.includes(routerPath)) {
            void router.push('/login');
        }
    }, [router, routerPath, isAuthenticated]);

    return isAuthenticated() || !PROTECTED_ROUTES.includes(routerPath) ? (
        <Route>{children}</Route>
    ) : (
        <Loader />
    );
};

export default ProtectedRoute;
