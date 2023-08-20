import * as Sentry from "@sentry/react";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "contexts/AuthContext";
import { isUserOnboarded } from "pages/api/user";

interface RouteProps {
    children: ReactNode;
}

function Route({ children }: RouteProps) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const routerPath = router.pathname;

    useEffect(() => {
        if (!isAuthenticated() || router.pathname.endsWith('/register/details')) return;
        
        isUserOnboarded(user.uid)
            .then(isOnboarded => {
                if (!isOnboarded) router.push('/register/details');
            })
            .catch(err => {
                Sentry.captureException(err);
                console.error(err);
            })
    }, [ user, isAuthenticated, routerPath, router ]);

    return (
        <>
            {children}
        </>
    );
}

export default Route;
