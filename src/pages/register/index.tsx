import { useState, SyntheticEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { useAuth } from "context/AuthContext";
import { addUser } from "pages/api/user";

function Register() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [shouldRememberCheckbox, setShouldRememberCheckbox] =
		useState<boolean>(false);

	const { register, loginWithGoogle, setShouldRemember, logout } = useAuth();
	const router = useRouter();

	const handleSubmitEmail = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		await setShouldRemember(shouldRememberCheckbox);
		await register(email, password)
			.then(async (credentials) => {
				await addUser({
					uid: credentials.user.uid,
					details: { email: credentials.user.email || "" },
				}).then(() => router.push("/register/details"));
			})
			.catch(async () => {
				await logout();
				router.push("/register/waitlist");
			});
	};

	const handleGmailLogin = async () => {
		await setShouldRemember(shouldRememberCheckbox);
		await loginWithGoogle()
			.then(async (credentials) => {
				await addUser({
					uid: credentials.user.uid,
					details: { email: credentials.user.email || "" },
				}).then(() => router.push("/register/details"));
			})
			.catch(async () => {
				await logout();
				router.push("/register/waitlist");
			});
	};

	const handleEmailChange = (e: FormEvent<HTMLInputElement>) =>
		setEmail(e.currentTarget.value);

	const handlePasswordChange = (e: FormEvent<HTMLInputElement>) =>
		setPassword(e.currentTarget.value);

	const handleShouldRememberChange = (e: FormEvent<HTMLInputElement>) =>
		setShouldRememberCheckbox(e.currentTarget.checked);

	return (
		<main className="h-full">
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Image
						className="mx-auto h-12 w-auto"
						src="/images/gosolve_logo.svg"
						alt="goSolve Logo"
						width={180}
						height={37}
						priority
					/>
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

							<div>
								<button
									type="submit"
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
	);
}

export default Register;
