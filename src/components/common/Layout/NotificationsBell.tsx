import { IMessage, NotificationBell, NovuProvider, PopoverNotificationCenter } from "../../../../external/novu-notification-center";
import Tippy from "@tippyjs/react";
import { ReactElement, useContext } from "react";
import { useAuth } from "context/AuthContext";

function NotificationsBell({ bellIcon }: { bellIcon: ReactElement }) {
    const auth = useAuth();

    const onNotificationClick = (message: IMessage) => {
        // your logic to handle the notification click
        if (message?.cta?.data?.url) {
          window.location.href = message.cta.data.url;
        }
    }

    if (!auth?.user?.uid) return null;

    return (
        <NovuProvider
            subscriberId={auth.user.uid}
            applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APPLICATION_ID}
        >
            <PopoverNotificationCenter
                onNotificationClick={onNotificationClick}
                colorScheme={'light'}
                footer={() => null}
            >
                {({ unseenCount }) =>
                    <Tippy content="Notifications">
                        <div>
                            <NotificationBell unseenCount={unseenCount} bellIcon={bellIcon} />
                        </div>
                    </Tippy>
                }
            </PopoverNotificationCenter>
        </NovuProvider>
    );
}

export default NotificationsBell;
