import { useState, useEffect, SyntheticEvent, FormEvent } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { updatePassword } from "@firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { db } from "utils/firebase";
import { Layout } from "components/common";
import { useAuth } from "context/AuthContext";
import { updateUser } from "./api/user";

function Settings() {
	const { user, logout, login } = useAuth();

	const [userProfile] = useDocument(doc(db, `user`, user?.uid || ""), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const [name, setName] = useState<string>(user?.displayName || "");
	const [username, setUsername] = useState<string>(user?.displayName || "");
	const [birthYear, setBirthYear] = useState<number>(0);
	const [password, setPassword] = useState<string>("");

	useEffect(() => {
		const userProfileData = userProfile?.data();

		if (userProfileData?.name) setName(userProfileData.name);
		if (userProfileData?.username) setUsername(userProfileData.username);
		if (userProfileData?.birthYear) setBirthYear(userProfileData.birthYear);
	}, [userProfile]);

	const handleSave = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		await updateUser({
			docId: user?.uid || "",
			details: { name, username, birthYear },
		}).then(() => toast.success("Saved!"));
	};

	const hasChanges = () =>
		userProfile?.data()?.name !== name ||
		userProfile?.data()?.username !== username ||
		userProfile?.data()?.birthYear !== birthYear;

	const handleNameChange = (e: FormEvent<HTMLInputElement>) =>
		setName(e.currentTarget.value);

	const handleUsernameChange = (e: FormEvent<HTMLInputElement>) =>
		setUsername(e.currentTarget.value);

	const handleBirthYearChange = (e: FormEvent<HTMLInputElement>) =>
		setBirthYear(e.currentTarget.valueAsNumber);

	const handlePasswordChange = (e: FormEvent<HTMLInputElement>) =>
		setPassword(e.currentTarget.value);

	const handleChangePassword = () => {
		// TODO add modal, to retype password, reauthenticate, and call updatePassword(newPassword)
	};

	const handleLogoutClick = () => logout();

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
										value={birthYear}
									/>
								</div>
							</div>

							<div>
								<button
									disabled={!hasChanges()}
									type="submit"
									className="flex w-full justify-center rounded-md border border-transparent disabled:opacity-70 disabled:cursor-not-allowed bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									Save
								</button>
							</div>
						</form>

						<button
							onClick={handleLogoutClick}
							className="mt-5 w-full flex justify-center items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Logout
						</button>
					</div>
				</div>
			</div>

			<ToastContainer
				position="bottom-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</Layout>
	);
}

export default Settings;
