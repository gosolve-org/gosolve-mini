import { TOAST_IDS } from 'common/constants/toastConstants';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';

export const showLinkToast = (
    type: 'info' | 'warning' | 'success' | 'error',
    message: string,
    href: string,
) => {
    toast[type](
        <div className="text-center">
            <Link href={href}>{message}</Link>
        </div>,
        {
            containerId: TOAST_IDS.linkToastId,
        },
    );
};

interface LinkToastProps {
    enableMultiToast?: boolean;
}

const LinkToast = ({ enableMultiToast = false }: LinkToastProps) => {
    return (
        <ToastContainer
            position="bottom-center"
            hideProgressBar
            newestOnTop={false}
            enableMultiContainer={enableMultiToast ?? false}
            containerId={TOAST_IDS.linkToastId}
            rtl={false}
            draggable
            theme="light"
            closeOnClick={false}
            closeButton
        />
    );
};

export default LinkToast;
