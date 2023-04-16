import { useState, SyntheticEvent, FormEvent } from "react";
import { useRouter } from "next/router";

import { useAuth } from "context/AuthContext";
import { updateUser } from "pages/api/user";
import { toast } from "react-toastify";
import BasicToast from "components/common/Layout/BasicToast";
import { USER_VALIDATIONS } from "constants/validationRules";
import BasicHead from "components/common/Layout/BasicHead";
import Logo from "components/common/Layout/Logo";

function Details() {
	const { user } = useAuth();

	const [name, setName] = useState<string>(user?.name || user?.displayName || "");
	const [username, setUsername] = useState<string>(user?.username || "");
	const [birthYear, setBirthYear] = useState<number|null>(user?.birthYear ?? null);
	const [isLoading, setIsLoading] =  useState(false);

	const router = useRouter();

	const handleSubmitDetails = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!user?.uid) {
			router.push('/login');
		}

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

		try {
			await updateUser({
				details: {
					name,
					username,
					birthYear,
					isOnboarded: true
				},
			});
			await router.push("/");
		} catch (err) {
			if (err.code === 'functions/invalid-argument') {
				toast.error(err.message);
			} else {
				toast.error('Something went wrong');
				console.error(err);
			}
		} finally {
			setIsLoading(false);
		}
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

	return (
		<>
			<BasicHead title="goSolve | Onboarding" />
			<main className="h-full">
				<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<Logo className="mx-auto h-18 w-auto" />
						<h2 className="mt-6 px-4 py-2 text-center text-m tracking-tight text-black ">
							Thanks for joining goSolve
						</h2>
					</div>

					<div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
							<form
								className="space-y-6"
								action="#"
								method="POST"
								onSubmit={handleSubmitDetails}
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
											maxLength={USER_VALIDATIONS.nameMaxLength}
											value={name.substring(0, USER_VALIDATIONS.nameMaxLength)}
											autoComplete="name"
											required
											className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											onChange={handleNameChange}
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
											maxLength={USER_VALIDATIONS.usernameMaxLength}
											value={username.substring(0, USER_VALIDATIONS.usernameMaxLength)}
											autoComplete="current-username"
											required
											className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											onChange={handleUsernameChange}
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
											value={birthYear?.toString() || ''}
											maxLength={4}
											required
											className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											onChange={handleBirthYearChange}
										/>
									</div>
								</div>

								<div>
									<button
										type="submit"
										disabled={isLoading}
										className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										Continue
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</main>
			<BasicToast />
		</>
	);
}

export default Details;
