import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

import { Layout } from "components/common";
import { toast } from "react-toastify";
import { updateAction } from "pages/api/action";
import { db, useDocumentOnceWithDependencies } from "utils/firebase";
import { useAuth } from "context/AuthContext";

import actionEditorTemplate from "editorTemplates/actionEditorTemplate.json"

const EditorJs = dynamic(() => import("components/common/Editor"), {
	ssr: false,
});

function Action() {
	const { user } = useAuth();
	const router = useRouter();

	const actionId = router?.query?.actionId?.toString();

	const [userProfile, userLoading] = useDocumentOnceWithDependencies(doc(db, `user`, user?.uid), [ user?.uid ]);

	const canUserEdit =
		userProfile?.id === user?.uid &&
		(userProfile?.data()?.role === "admin" ||
			userProfile?.data()?.role === "editor");

	const [actionsCollection, actionsLoading] = useDocumentOnce(doc(db, "actions", actionId));

	const actionContent = actionsCollection?.data()?.content || JSON.stringify(actionEditorTemplate);

	const handleSaveData = async (savedData: string) => {
		await updateAction({
			docId: actionId,
			details: {
				content: savedData,
			},
		})
			.then(() => toast.success("Saved!"))
			.catch((err) => {
				toast.error("Something went wrong");
				console.error(err);
			});
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
		</Layout>
	);
}

export default Action;
