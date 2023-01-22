//@ts-nocheck
// https://github.com/Jungwoo-An/react-editor-js/issues/193
import { useCallback, useEffect, useRef, useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "constants/editorTools";
import { useLeavePageConfirm } from "utils/customHooks";

interface EditorProps {
	defaultValue?: string;
	saveData?: (savedData: string) => void;
	onChange?: (savedData: string) => void;
	readOnly?: boolean;
}

const Editor = ({
	defaultValue,
	saveData,
	onChange,
	readOnly = true,
}: EditorProps) => {
	const ReactEditorJS = createReactEditorJS();

	const editorJS = useRef(null);

	const [data, setData] = useState("");
	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		defaultValue && !data && setData(JSON.parse(defaultValue));
	}, [data, defaultValue]);

	useLeavePageConfirm(hasChanges);

	const handleInitialize = useCallback(async (instance) => {
		if (!editorJS.current) editorJS.current = instance;
	}, []);

	const handleSaveClick = useCallback(async () => {
		const savedData = await editorJS?.current?.save();
		saveData && saveData(JSON.stringify(savedData));
		setHasChanges(false);
	}, [saveData]);

	const handleChange = useCallback(async () => {
		setHasChanges(true);
		// const savedData = await editorJS?.current?.save();
		// onChange && onChange(JSON.stringify(savedData));
		// setData(savedData);
	}, []);

	// https://github.com/Jungwoo-An/react-editor-js/issues/200
	const updateValue = useCallback((data) => {
		editorJS?.current?._editorJS?.isReady.then(() => {
			editorJS.current._editorJS.render(data);
		});
	}, []);

	return (
		<div className="content">
			<div>
				{!readOnly && hasChanges ? (
					<div className="mt-6 flex justify-center items-center w-full gap-4">
						<button
							onClick={handleSaveClick}
							type="button"
							className="text-xs font-light inline-flex items-center rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-black shadow-sm hover:bg-indigo-500 hover:border-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Save
						</button>
					</div>
				) : null}
			</div>
			<ReactEditorJS
				holder="editorjs-container"
				onChange={handleChange}
				readOnly={readOnly}
				enableReInitialize={true}
				onInitialize={handleInitialize}
				tools={EDITOR_JS_TOOLS}
				defaultValue={!!defaultValue ? JSON.parse(defaultValue) : null}
				minHeight="100"
			/>
		</div>
	);
};

export default Editor;
