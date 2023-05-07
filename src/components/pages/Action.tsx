import { useRouter } from "next/router";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import Layout from "components/common/layout/Layout";
import { db } from "utils/firebase";
import BasicHead from "components/common/layout/BasicHead";
import Resource from "components/common/Resource";

function Action() {
    const router = useRouter();

    const actionId = router?.query?.actionId?.toString();

    const [actionSnapshot] = useDocumentOnce(doc(db, "actions", actionId));

    return (
        <Layout>
            <BasicHead title={`goSolve | ${actionSnapshot?.data()?.title ?? ''}`} />
            <div className="flex min-h-full flex-col justify-center items-center py-6 sm:py-12 xl:px-6">
                <div className="w-full max-w-screen-2xl">
                    <Resource />
                </div>
            </div>
        </Layout>
    );
}

export default Action;
