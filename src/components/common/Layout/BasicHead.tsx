import Head from "next/head";

interface BasicHeadProps {
    title?: string;
    description?: string;
}

function BasicHead({ title, description }: BasicHeadProps) {
    return (
        <Head>
            <title>{title ?? 'goSolve'}</title>
            <meta name="description" content={description ?? title ?? 'goSolve'} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}

export default BasicHead;
