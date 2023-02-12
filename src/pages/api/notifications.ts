import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

const createSubscriberFunction = httpsCallable(functions, 'createSubscriber');

const createSubscriber = async () => {
    await createSubscriberFunction();
}

export { createSubscriber };
