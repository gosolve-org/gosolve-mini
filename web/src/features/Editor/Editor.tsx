//@ts-nocheck
// https://github.com/Jungwoo-An/react-editor-js/issues/193
import { useCallback, useEffect, useRef, useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import { useLeavePageConfirm } from "utils/customHooks";
import { useResource } from "features/Resource/ResourceContext";
import { EDITOR_JS_TOOLS } from "./editorTools";

interface EditorProps {
    defaultValue?: string;
    saveData?: (savedData: string) => Promise<void>;
    onChange?: (savedData: string) => Promise<void>;
    readOnly?: boolean;
}

const Editor = ({
    defaultValue,
    saveData,
    readOnly = true,
}: EditorProps) => {
    const { focusedEditorElementIndex } = useResource();

    const ReactEditorJS = createReactEditorJS();

    const editorJS = useRef(null);
    const containerRef = useRef(null);

    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useLeavePageConfirm(hasChanges);

    const handleInitialize = useCallback(async (instance) => {
        if (!editorJS.current) editorJS.current = instance;
    }, []);

    const handleSaveClick = useCallback(async () => {
        try {
            setIsLoading(true);
            const savedData = await editorJS?.current?.save();
            saveData && await saveData(JSON.stringify(savedData));
            setHasChanges(false);
        } finally {
            setIsLoading(false);
        }
    }, [saveData]);

    const handleChange = useCallback(async () => {
        setHasChanges(true);
        // const savedData = await editorJS?.current?.save();
        // onChange && onChange(JSON.stringify(savedData));
        // setData(savedData);
    }, []);

    useEffect(() => {
        if (focusedEditorElementIndex === null || editorJS.current == null) {
            return;
        }

        const blockEls = [...containerRef.current.querySelectorAll('.ce-block')];
        if (blockEls.length <= focusedEditorElementIndex) {
            return;
        }

        const elToFocus = blockEls[focusedEditorElementIndex];
        elToFocus.scrollIntoView({ behavior: 'smooth', block: 'start' });
        elToFocus.focus({ preventScroll: true });
    }, [ focusedEditorElementIndex, editorJS, containerRef ]);

    return (
        <div className="content" ref={containerRef}>
            <div>
                {!readOnly && hasChanges ? (
                    <div className="mt-6 flex justify-center items-center w-full gap-4">
                        <button
                            onClick={handleSaveClick}
                            disabled={isLoading}
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
