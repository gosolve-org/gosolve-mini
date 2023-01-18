//@ts-nocheck
// https://github.com/Jungwoo-An/react-editor-js/issues/193
import { useCallback, useRef } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "constants/editorTools";

interface EditorProps {
	defaultValue?: string;
	saveData?: (savedData: string) => void;
	readOnly?: boolean;
}

const Editor = ({ defaultValue, saveData, readOnly = true }: EditorProps) => {
	const ReactEditorJS = createReactEditorJS();

	const editorJS = useRef(null);

	const handleInitialize = useCallback((instance) => {
		editorJS.current = instance;
	}, []);

	const handleSave = useCallback(async () => {
		const savedData = await editorJS?.current?.save();
		(await saveData) && saveData(JSON.stringify(savedData));
	}, [saveData]);

	return (
		<div className="content">
			<ReactEditorJS
				readOnly={readOnly}
				enableReInitialize={true}
				onInitialize={handleInitialize}
				tools={EDITOR_JS_TOOLS}
				defaultValue={JSON.parse(defaultValue)}
			/>
			{!readOnly ? (
				<div className="mt-6 flex justify-center items-center w-full gap-4">
					<button
						onClick={handleSave}
						type="button"
						className="text-xs font-light inline-flex items-center rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-black shadow-sm hover:bg-indigo-500 hover:border-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Save changes
					</button>
				</div>
			) : null}
		</div>
	);
};

export default Editor;
