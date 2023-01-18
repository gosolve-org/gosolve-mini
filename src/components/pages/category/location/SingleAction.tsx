import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

import { Layout } from "components/common";
import { ToastContainer, toast } from "react-toastify";
import { updateAction } from "pages/api/action";
import { db } from "utils/firebase";
import { useAuth } from "context/AuthContext";

const EditorJs = dynamic(() => import("components/common/Editor"), {
	ssr: false,
});

function SingleAction() {
	const { user } = useAuth();
	const router = useRouter();

	const actionId = router?.query?.action
		? router?.query?.action.toString()
		: "";

	const [userProfile, userLoading] = useDocument(
		doc(db, `user`, user?.uid || ""),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const canUserEdit =
		userProfile?.data()?.role === "admin" ||
		userProfile?.data()?.role === "editor";

	const [actionsCollection, actionsLoading] = useDocument(
		doc(db, "actions", actionId),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	// TODO Seems like error with library if there are no blocks so set default block
	const actionContent =
		actionsCollection?.data()?.content ||
		`{"time":1674009351098,"blocks":[{"id":"lLg8bWk7VH","type":"header","data":{"text":"Start typing...","level":1}}],"version":"2.26.4"}`;

	const handleSaveData = async (savedData: string) => {
		await updateAction({
			docId: actionId,
			details: {
				content: savedData,
			},
		})
			.then(() => toast.success("Saved!"))
			.catch(() => toast.error("Something went wrong"));
	};

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="mt-10">
						{!actionsLoading && !userLoading ? (
							<EditorJs
								readOnly={!canUserEdit}
								saveData={handleSaveData}
								defaultValue={actionContent}
							/>
						) : null}
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

export default SingleAction;
