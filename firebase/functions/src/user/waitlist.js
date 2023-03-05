const axios = require("axios").default;
const functions = require("firebase-functions");
const { defineString } = require("firebase-functions/params");

const WAITLIST_API_KEY = defineString('WAITLIST_API_KEY');

module.exports.getWaitlistUser = async email => {
	const urlSearchParams = new URLSearchParams({
		email,
		api_key: WAITLIST_API_KEY.value()
	});

    try {
        const response = await axios.get("https://api.getwaitlist.com/api/v1/waiter?" + urlSearchParams);
        return response.data;
    } catch (err) {
        if (err?.response?.data.error_code === 'NO_WAITER_FOUND') {
            return null;
        }

        functions.logger.error(`Something went wrong fetching a waitlist user.`, err?.response);
    }
}
