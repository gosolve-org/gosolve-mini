/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				'gos-green': '#1CBF84',
				'gos-green-light': '#68DAB2'
			}
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require('@tailwindcss/line-clamp'),
	],
};
