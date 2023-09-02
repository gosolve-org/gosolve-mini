import Tippy from '@tippyjs/react';
import { type ReactElement } from 'react';
import { useAuth } from 'features/Auth/AuthContext';
import * as Sentry from '@sentry/react';
import {
    type IMessage,
    NotificationBell,
    NovuProvider,
    PopoverNotificationCenter,
} from '../../../external/novu-notification-center';

const NotificationsBell = ({ bellIcon }: { bellIcon: ReactElement }) => {
    const auth = useAuth();

    const onNotificationClick = (message: IMessage) => {
        if (message?.cta?.data?.url) {
            window.location.href = message.cta.data.url;
        }
    };

    if (!auth?.user?.uid) return null;

    if (process.env.NEXT_PUBLIC_NOVU_APPLICATION_ID == null) {
        console.error('NEXT_PUBLIC_NOVU_APPLICATION_ID is not set');
        Sentry.captureMessage('NEXT_PUBLIC_NOVU_APPLICATION_ID is not set', 'error');
        return null;
    }

    return (
        <NovuProvider
            subscriberId={auth.user.uid}
            applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APPLICATION_ID}
        >
            <PopoverNotificationCenter
                onNotificationClick={onNotificationClick}
                colorScheme="light"
                footer={() => null as any}
            >
                {({ unseenCount }) => (
                    <Tippy content="Notifications">
                        <div>
                            <NotificationBell unseenCount={unseenCount} bellIcon={bellIcon} />
                        </div>
                    </Tippy>
                )}
            </PopoverNotificationCenter>
        </NovuProvider>
    );
};

export default NotificationsBell;
