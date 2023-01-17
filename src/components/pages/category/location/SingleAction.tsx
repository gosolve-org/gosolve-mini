import dynamic from "next/dynamic";

import { Layout } from "components/common";

const EditorJs = dynamic(() => import("components/common/Editor"), {
	ssr: false,
});

function SingleAction() {
	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="mt-10">
						<EditorJs />
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default SingleAction;
