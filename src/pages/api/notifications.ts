import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

const createSubscriberFunction = httpsCallable(functions, 'createSubscriber');

const createSubscriber = async (userId: string, email: string) => {
    await createSubscriberFunction({ userId, email });
}

export { createSubscriber };
