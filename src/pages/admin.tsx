import { useState, FormEvent } from "react";
import { doc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db, useDocumentOnceWithDependencies } from "utils/firebase";
import { Layout } from "components/common";
import { useAuth } from "context/AuthContext";
import { addToAllowList } from "./api/admin";
import StyledToast from "components/common/Layout/StyledToast";

function Admin() {
	const { user } = useAuth();

	const [allowListEmail, setAllowListEmail] = useState("");

	const [userProfile] = useDocumentOnceWithDependencies(doc(db, `user`, user?.uid), [ user?.uid ]);

	const isAdmin = userProfile?.data().role === "admin";
	const hasChanges = () => !!allowListEmail;

	const handleAllowListEmailChange = (e: FormEvent<HTMLInputElement>) =>
		setAllowListEmail(e.currentTarget.value);

	const handleAddToAllowList = async () => {
		await addToAllowList(allowListEmail).then(() =>
			toast.success("Saved!")
		);
		setAllowListEmail("");
	};

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				{isAdmin ? (
					<>
						<div className="sm:mx-auto sm:w-full sm:max-w-md">
							<h1 className="mt-6 px-4 py-2 text-center text-xl font-small tracking-tight text-black ">
								Admin panel
							</h1>
						</div>

						<div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Add to allowlist
								</label>
								<div className="mt-1">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="name"
										required
										className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
										onChange={handleAllowListEmailChange}
										value={allowListEmail}
									/>
								</div>
								<button
									disabled={!hasChanges()}
									onClick={handleAddToAllowList}
									className="mt-4 flex w-full justify-center rounded-md border border-transparent disabled:opacity-70 disabled:cursor-not-allowed bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									Add
								</button>
							</div>
						</div>
					</>
				) : (
					<div>Not allowed</div>
				)}
			</div>
		</Layout>
	);
}

export default Admin;
