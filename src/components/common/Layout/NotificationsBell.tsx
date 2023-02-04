import { IMessage, NotificationBell, NovuProvider, PopoverNotificationCenter } from "../../../../external/novu-notification-center";
import Tippy from "@tippyjs/react";
import { ReactElement } from "react";

function NotificationsBell({ bellIcon }: { bellIcon: ReactElement }) {
    const onNotificationClick = (message: IMessage) => {
        // your logic to handle the notification click
        if (message?.cta?.data?.url) {
          window.location.href = message.cta.data.url;
        }
    }

    return (
        <NovuProvider
            subscriberId={'63de5aa433a4f2991918bfc5'}
            applicationIdentifier={'7etHL8POp3K5'}
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
