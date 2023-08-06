import * as Sentry from "@sentry/react";
import { FormEvent, MutableRefObject, SyntheticEvent, useState } from "react";
import { toast } from "react-toastify";

interface ReplyFormProps {
    handleSubmit: (reply: string) => Promise<void>;
    buttonText?: string;
    placeholderText?: string;
    showSuccessToast?: boolean;
    successToastMessage?: string;
    textareaRef?: MutableRefObject<any>;
}

function ReplyForm({
    handleSubmit,
    buttonText = 'Post reply',
    placeholderText = 'Add your reply',
    showSuccessToast = false,
    successToastMessage,
    textareaRef
}: ReplyFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [reply, setReply] = useState('');

    const handleReplyChange = (e: FormEvent<HTMLTextAreaElement>) =>
        setReply(e.currentTarget.value);

    const handleReplySubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await handleSubmit(reply);
            setReply('');
            if (showSuccessToast) toast.success(successToastMessage);
        } catch (err) {
            Sentry.captureException(err);
            console.error(err);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <>
        <div className="min-w-0 flex-1 mt-4">
            <form
                action="#"
                className="relative"
                method="POST"
                onSubmit={handleReplySubmit}
            >
                <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <label htmlFor="comment" className="sr-only">
                        {placeholderText}
                    </label>
                    <textarea
                        rows={3}
                        name="comment"
                        id="comment"
                        className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
                        placeholder={placeholderText}
                        value={reply}
                        onChange={handleReplyChange}
                        ref={!!textareaRef ? textareaRef : null}
                    />
                </div>

                <div className="flex-shrink-0 mt-4">
                    <button
                        disabled={!reply || isLoading}
                        type="submit"
                        className="inline-flex items-center disabled:opacity-70 disabled:bg-indigo-600 disabled:cursor-not-allowed rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    </>);
}

export default ReplyForm;
