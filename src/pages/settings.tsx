import { useState, SyntheticEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { Layout } from "components/common";
import { useAuth } from "context/AuthContext";

function Settings() {
	const { user } = useAuth();

	const [name, setName] = useState<string>(user?.displayName || "");
	const [username, setUsername] = useState<string>(user?.displayName || "");
	const [birthYear, setBirthYear] = useState<number>(0);
	const [password, setPassword] = useState<string>("");

	const router = useRouter();

	const handleSave = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const handleNameChange = (e: FormEvent<HTMLInputElement>) =>
		setName(e.currentTarget.value);

	const handleUsernameChange = (e: FormEvent<HTMLInputElement>) =>
		setUsername(e.currentTarget.value);

	const handleBirthYearChange = (e: FormEvent<HTMLInputElement>) =>
		setBirthYear(e.currentTarget.valueAsNumber);

	const handlePasswordChange = (e: FormEvent<HTMLInputElement>) =>
		setPassword(e.currentTarget.value);

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h1 className="mt-6 px-4 py-2 text-center text-xl font-small tracking-tight text-black ">
						Account settings
					</h1>
				</div>

				<div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
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

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default Settings;
