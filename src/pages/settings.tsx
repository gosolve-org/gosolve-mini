import * as Sentry from '@sentry/node'
import { useState, useEffect, SyntheticEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { doc } from "firebase/firestore";
import { updatePassword } from "@firebase/auth";
import { toast } from "react-toastify";

import { db, useDocumentOnceWithDependencies } from "utils/firebase";
import Layout from "components/common/layout/Layout";
import { useAuth } from "contexts/AuthContext";
import { updateUser } from "./api/user";
import { USER_VALIDATIONS } from "constants/validationRules";
import BasicHead from "components/common/layout/BasicHead";
import Link from "next/link";

function Settings() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [userProfile] = useDocumentOnceWithDependencies(() => doc(db, `user`, user.uid), [ user?.uid ]);

    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [birthYear, setBirthYear] = useState<number|null>(null);
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userProfileData = userProfile?.data();

        if (userProfileData?.name) setName(userProfileData.name);
        if (userProfileData?.username) setUsername(userProfileData.username);
        if (userProfileData?.birthYear) setBirthYear(userProfileData.birthYear);

        setIsLoading(false);
    }, [userProfile]);

    const handleSave = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const validate = (boolResult: boolean, errorMessage: string): boolean => {
            if (!boolResult) {
                setIsLoading(false);
                toast.error(errorMessage);
                return false;
            }

            return true;
        };

        if (!validate(new Date().getFullYear() - birthYear >= USER_VALIDATIONS.birthYearMinAge, `You need to be at least ${USER_VALIDATIONS.birthYearMinAge} years old to join our platform.`)) return;
        if (!validate(birthYear >= USER_VALIDATIONS.birthYearMin, 'Please enter a valid birth year.')) return;
        if (!validate(name.length >= USER_VALIDATIONS.nameMinLength, 'Please enter a valid name.')) return;
        if (!validate(name.length <= USER_VALIDATIONS.nameMaxLength, `Your username cannot exceed ${USER_VALIDATIONS.nameMaxLength} characters.`)) return;
        if (!validate(username.length >= USER_VALIDATIONS.usernameMinLength, `Your username needs to be at least ${USER_VALIDATIONS.usernameMinLength} characters.`)) return;
        if (!validate(username.length <= USER_VALIDATIONS.usernameMaxLength, `Your username cannot exceed ${USER_VALIDATIONS.usernameMaxLength} characters.`)) return;
        if (!validate(/^[a-zA-Z0-9\.\_\-]+$/.test(username), 'Your username can only contain letters, numbers, hyphens, underscores and periods.')) return;

        await updateUser({
            details: { name, username, birthYear },
        })
        .then(() => {
            toast.success('Saved!');
        })
        .catch(err => {
            if (err.code === 'functions/invalid-argument') {
                toast.error(err.message);
            } else {
                Sentry.captureException(err);
                toast.error('Something went wrong');
                console.error(err);
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const handleNameChange = (e: FormEvent<HTMLInputElement>) =>
        setName(e.currentTarget.value);

    const handleUsernameChange = (e: FormEvent<HTMLInputElement>) =>
        setUsername(e.currentTarget.value);

    const handleBirthYearChange = (e: FormEvent<HTMLInputElement>) =>
    {
        if (!e.currentTarget.value) return;
        setBirthYear(e.currentTarget.valueAsNumber);
    }

    const handlePasswordChange = (e: FormEvent<HTMLInputElement>) =>
        setPassword(e.currentTarget.value);

    const handleChangePassword = () => {
        // TODO (only if auth method is email, NOT google) add modal, to retype password, reauthenticate, and call updatePassword(newPassword)
    };

    const handleLogoutClick = async () => {
        setIsLoading(true);
        try {
            await logout();
            await router.push("/login");
        } catch (err) {
            setIsLoading(false);
            throw err;
        }
    };

    return (
        <Layout>
            <BasicHead title="goSolve | Account settings" />
            <div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h1 className="mt-6 px-4 py-2 text-center text-xl tracking-tight text-black ">
                        Account settings
                    </h1>
                </div>

                <div className="mt-3 sm:mx-auto w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form
                            className="space-y-6"
                            action="#"
                            method="POST"
                            onSubmit={handleSave}
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="name"
                                        autoComplete="name"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        onChange={handleNameChange}
                                        maxLength={USER_VALIDATIONS.nameMaxLength}
                                        disabled={isLoading}
                                        value={name}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="username"
                                        autoComplete="current-username"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        onChange={handleUsernameChange}
                                        maxLength={USER_VALIDATIONS.usernameMaxLength}
                                        disabled={isLoading}
                                        value={username}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="birthYear"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Birth year
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="birthYear"
                                        name="birthYear"
                                        type="number"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        onChange={handleBirthYearChange}
                                        maxLength={4}
                                        disabled={isLoading}
                                        value={birthYear?.toString() || ''}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="flex w-full justify-center rounded-md border border-transparent disabled:opacity-70 disabled:cursor-not-allowed bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Save
                                </button>
                            </div>
                        </form>

                        <button
                            disabled={isLoading}
                            onClick={handleLogoutClick}
                            className="mt-5 w-full flex justify-center items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>


                <div className="mt-3 sm:mx-auto w-full sm:max-w-md">
                    <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10 text-sm font-normal text-gray-400">
                        Check out
                        goSolve&apos;s{" "}
                        <Link href="/privacy" className="underline" target={"_blank"}>
                            Privacy Policy
                        </Link>
                        {" "}and{" "}
                        <Link href="/terms-and-conditions" className="underline" target={"_blank"}>
                            Terms & Conditions
                        </Link>
                        {" "}here.
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Settings;
