import { TOAST_IDS } from "constants/toastConstants";
import { ToastContainer } from "react-toastify";

interface LinkToastProps {
    enableMultiToast?: boolean|null;
}

function BasicToast({ enableMultiToast }: LinkToastProps) {
    return (
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
            enableMultiContainer={enableMultiToast ?? false}
            containerId={TOAST_IDS.basicToastId}
        />
    );
}

export default BasicToast;
