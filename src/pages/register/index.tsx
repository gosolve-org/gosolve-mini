import { useState, SyntheticEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useAuth } from "context/AuthContext";
import { toast } from "react-toastify";
import BasicToast from "components/common/Layout/BasicToast";
import { ErrorWithCode } from "models/ErrorWithCode";
import { ERROR_CODES } from "constants/errorCodes";
import LinkToast, { showLinkToast } from "components/common/Layout/LinkToast";
import { UserCredential } from "@firebase/auth";
import { TOAST_IDS } from "constants/toastConstants";
import BasicHead from "components/common/Layout/BasicHead";
import Logo from "components/common/Layout/Logo";
import { USER_VALIDATIONS } from "constants/validationRules";

function Register() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [shouldRememberCheckbox, setShouldRememberCheckbox] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);

	const { registerWithEmail, registerWithGoogle, getGoogleCredentials, setShouldRemember, logout } = useAuth();
	const router = useRouter();

	const handleRegistration = async (registration: Promise<UserCredential>, credentials?: UserCredential|null) => {
		try {
			await registration;
			await router.push("/register/details");
		} catch (err) {
			if (err instanceof ErrorWithCode && err.code === ERROR_CODES.waitlistUserNotFound) {
				showLinkToast(
					'error',
					`You don't have access to the platform yet. Click here to join our waitlist.`,
					`https://${process.env.NEXT_PUBLIC_GOSOLVE_HOST}/?waitlist_email=${encodeURIComponent(credentials?.user?.email ?? email)}#waitlist`);
			} else if (err instanceof ErrorWithCode && err.code === ERROR_CODES.waitlistUserNotOffboarded) {
				showLinkToast(
					'error',
					`You're still on the waitlist. Click here to check your status.`,
					`https://${process.env.NEXT_PUBLIC_GOSOLVE_HOST}/?waitlist_state=check&waitlist_email=${encodeURIComponent(credentials?.user?.email ?? email)}#waitlist`);
			} else if (err instanceof ErrorWithCode && err.code === ERROR_CODES.userAlreadyExists) {
				toast.error('A user with this email already exists.', { containerId: TOAST_IDS.basicToastId });
			} else {
				console.error(err);
				toast.error('Something went wrong', { containerId: TOAST_IDS.basicToastId });
			}
		}
	}

	const handleSubmitEmail = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isLoading) return;
		setIsLoading(true);

		if (!password || password.length < 8) {
			toast.error('Password should contain at least 8 characters.', { containerId: TOAST_IDS.basicToastId });
			setIsLoading(false);
			return;
		}

		try {
			setShouldRemember(shouldRememberCheckbox);
			await handleRegistration(registerWithEmail(email, password));
		} finally {
			setIsLoading(false);
		}
	};

	const handleGmailLogin = async () => {
		if (isLoading) return;
		setIsLoading(true);

		setShouldRemember(shouldRememberCheckbox);
		try {
			const credentials = await getGoogleCredentials();
			await handleRegistration(registerWithGoogle(credentials), credentials);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailChange = (e: FormEvent<HTMLInputElement>) =>
		setEmail(e.currentTarget.value);

	const handlePasswordChange = (e: FormEvent<HTMLInputElement>) =>
		setPassword(e.currentTarget.value);

	const handleShouldRememberChange = (e: FormEvent<HTMLInputElement>) =>
		setShouldRememberCheckbox(e.currentTarget.checked);

	return (
		<>
			<BasicHead title="goSolve | Register" />
			<main className="h-full">
				<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<Logo className="mx-auto h-12 w-auto" />
						<h1 className="mt-6 text-center text-xl font-normal tracking-tight text-black">
							Create your account
						</h1>
					</div>

					<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
											onChange={handleEmailChange}
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
											maxLength={USER_VALIDATIONS.passwordMaxLength}
											required
											className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											onChange={handlePasswordChange}
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

								<div className="block text-sm font-normal text-gray-400">
									By creating an account, you accept
									goSolve&apos;s{" "}
									<Link href="/privacy" className="underline" target={"_blank"}>
										Privacy Policy
									</Link>
									{" "}and{" "}
									<Link href="/terms-and-conditions" className="underline" target={"_blank"}>
										Terms & Conditions
									</Link>
									.
								</div>

								<div>
									<button
										type="submit"
										disabled={isLoading}
										className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										Create your account
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
											disabled={isLoading}
											onClick={handleGmailLogin}
											className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
										>
											<span className="sr-only">
												Sign in with Google
											</span>
											<svg
												className="h-5 w-5 text-gray-500"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												strokeWidth="2"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
												/>
												<path d="M17.788 5.108A9 9 0 1021 12h-8" />
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<BasicToast enableMultiToast={true} />
			<LinkToast enableMultiToast={true} />
		</>
	);
}

export default Register;
