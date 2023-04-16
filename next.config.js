/** @type {import('next').NextConfig} */
// reactStrictMode: true when this fixed: https://github.com/Jungwoo-An/react-editor-js/issues/213
const nextConfig = {
    reactStrictMode: false,
    redirects: async () => {
        return [
            {
              source: '/',
              destination: '/goSolve/World',
              permanent: false,
              basePath: false
            },
            {
              source: '/privacy',
              destination: 'https://jarren.notion.site/Privacy-Policy-4e10334661ff48419c57fcbcdffa1bf9',
              permanent: false,
              basePath: false
            },
            {
              source: '/terms-and-conditions',
              destination: 'https://jarren.notion.site/Terms-Conditions-f27dfe37803d435594308f15f3355dfa',
              permanent: false,
              basePath: false
            },
        ];
    }
};

module.exports = nextConfig;
