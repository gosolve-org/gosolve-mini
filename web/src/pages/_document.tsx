import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
    return (
        <Html lang="en" className="h-full bg-gray-50">
            <Head />
            <body className="h-full">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;