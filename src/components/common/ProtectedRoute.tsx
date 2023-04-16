import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "context/AuthContext";
import Loader from "./Loader";
import { UNPROTECTED_ROUTES } from "constants/protectedRoutes";
import { isUserOnboarded } from "pages/api/user";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user } = useAuth();
    const router = useRouter();
    const routerPath = router.pathname;

    useEffect(() => {
        if (!user && !UNPROTECTED_ROUTES.includes(routerPath)) {
            router.push("/login");
        }
    }, [router, routerPath, user]);

    useEffect(() => {
        if (!user || router.pathname.endsWith('/register/details')) return;
        
        isUserOnboarded(user.uid)
            .then(isOnboarded => {
                if (!isOnboarded) router.push('/register/details');
            })
            .catch(err => {
                console.error(err);
            })
    }, [ user, routerPath, router ]);

    return (
        <>
            {user || UNPROTECTED_ROUTES.includes(routerPath) ? (
                children
            ) : (
                <Loader />
            )}
        </>
    );
}

export default ProtectedRoute;
