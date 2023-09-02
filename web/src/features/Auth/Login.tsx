import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useState, type SyntheticEvent, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/react';
import { useAuth } from 'features/Auth/AuthContext';
import { toast } from 'react-toastify';
import { AnalyticsEventEnum } from 'features/Analytics/AnalyticsEventEnum';
import { useAnalytics } from 'features/Analytics/AnalyticsContext';
import { ErrorWithCode } from 'common/models/ErrorWithCode';
import ERROR_CODES from 'common/constants/errorCodes';
import LinkToast, { showLinkToast } from 'common/components/layout/LinkToast';
import { TOAST_IDS } from 'common/constants/toastConstants';
import GoogleIconSvg from 'common/components/svgs/GoogleIconSvg';
import BasicToast from 'common/components/layout/BasicToast';

const Login = () => {
    const { logAnalyticsEvent } = useAnalytics();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [shouldRememberCheckbox, setShouldRememberCheckbox] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    const {
        login,
        logout,
        setIsLoginFinished,
        getGoogleCredentials,
        setShouldRemember,
        registerWithGoogle,
        doesUserExist,
        isAuthenticated,
    } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated()) {
            void router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSubmitEmail = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setShouldRemember(shouldRememberCheckbox);
        login(email, password)
            .then(async () => {
                logAnalyticsEvent(AnalyticsEventEnum.LoginEmail, {
                    shouldRemember: shouldRememberCheckbox,
                });
                await router.push('/');
            })
            .catch((err) => {
                setLoginFailed(true);
                if (err instanceof ErrorWithCode) {
                    if (err.code === ERROR_CODES.notFound) {
                        showLinkToast(
                            'error',
                            'No account with this email exists. Click here to create a new account',
                            `./register`,
                        );
                        return;
                    }

                    if (err.code === ERROR_CODES.wrongPassword) {
                        toast.error(
                            'Password is incorrect. Please try again or login with your Google account.',
                            {
                                containerId: TOAST_IDS.basicToastId,
                            },
                        );
                        return;
                    }
                }

                Sentry.captureException(err);
                console.error(err);
                toast.error('Something went wrong', { containerId: TOAST_IDS.basicToastId });
            })
            .finally(() => setIsLoading(false));
    };

    const handleGmailLogin = async () => {
        setIsLoading(true);
        setShouldRemember(shouldRememberCheckbox);

        try {
            setIsLoginFinished(false);
            const credentials = await getGoogleCredentials();

            if (credentials.user.email == null) {
                throw new Error('Google login failed');
            }

            if (!(await doesUserExist(credentials.user.email))) {
                logAnalyticsEvent(AnalyticsEventEnum.RegisterGoogle, {
                    shouldRemember: shouldRememberCheckbox,
                });
                await registerWithGoogle(credentials);
                await router.push('/register/details');
            } else {
                logAnalyticsEvent(AnalyticsEventEnum.LoginGoogle, {
                    shouldRemember: shouldRememberCheckbox,
                });
                await router.push('/');
            }
        } catch (err) {
            if (err.code === ERROR_CODES.popupClosedByUser) {
                return;
            }

            setLoginFailed(true);
            Sentry.captureException(err);
            console.error(err);
            toast.error('Something went wrong', { containerId: TOAST_IDS.basicToastId });
            try {
                await logout();
            } catch (logoutErr) {
                Sentry.captureException(logoutErr);
                console.error(logoutErr);
                toast.error('Could not log out after unsuccessful login.', {
                    containerId: TOAST_IDS.basicToastId,
                });
            }
        } finally {
            setIsLoading(false);
            setIsLoginFinished(true);
        }
    };

    const handleShouldRememberChange = (e: FormEvent<HTMLInputElement>) =>
        setShouldRememberCheckbox(e.currentTarget.checked);

    return (
        <>
            <div className="h-full">
                <div className="flex min-h-full flex-col justify-center items-center py-6 sm:px-6 lg:px-8">
                    <div className="mt-8 sm:mx-auto w-full sm:max-w-md mb-4">
                        <div className="bg-white py-8 shadow sm:rounded-lg px-4 sm:px-10">
                            <form
                                className="space-y-6"
                                action="#"
                                method="POST"
                                onSubmit={handleSubmitEmail}
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            onChange={(e) => setEmail(e.currentTarget.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            onChange={(e) => setPassword(e.currentTarget.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={handleShouldRememberChange}
                                        />
                                        <label
                                            htmlFor="remember-me"
                                            className="ml-2 block text-sm text-gray-900"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-2 text-gray-500">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    <div>
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={handleGmailLogin}
                                            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Sign in with Google</span>
                                            <GoogleIconSvg
                                                className="h-5 w-5 text-gray-500"
                                                width={24}
                                                height={24}
                                            />
                                        </button>
                                    </div>
                                </div>
                                {loginFailed && (
                                    <div className="mt-6 grid grid-cols-1 gap-3">
                                        <small className="text-gray-400 text-center">
                                            Having trouble signing in? Contact us at
                                            team@gosolve.org
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="sm:mx-auto w-full sm:max-w-md relative">
                        <button
                            type="button"
                            onClick={async () => {
                                await router.push('/register');
                            }}
                            className="w-full bg-white hover:bg-gray-100 cursor-pointer py-4 shadow sm:rounded-lg px-4 sm:px-10 text-gray-400 text-center"
                        >
                            New Solver? Register here
                            <ArrowRightIcon
                                className="h-4 w-4 inline-block items-center ml-1"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>
            </div>
            <BasicToast enableMultiToast />
            <LinkToast enableMultiToast />
        </>
    );
};

export default Login;
