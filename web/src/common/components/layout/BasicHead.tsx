import Head from 'next/head';

interface BasicHeadProps {
    title?: string;
    description?: string;
}

const BasicHead = ({ title = 'goSolve', description }: BasicHeadProps) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description ?? title} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
};

export default BasicHead;
