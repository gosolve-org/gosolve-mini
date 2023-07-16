const { withSentryConfig } = require("@sentry/nextjs");

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


// Injected content via Sentry wizard below
module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: process.env.NEXT_PUBLIC_SENTRY_ORG,
    project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
    authToken: process.env.NEXT_PUBLIC_SENTRY_TOKEN,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
