import Image from 'next/image';

interface LoaderProps {
    size?: number;
}

const Loader = ({ size = 48 }: LoaderProps) => {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <Image
                className="mx-auto motion-safe:animate-spin"
                src="/images/icon_sm.png"
                alt="goSolve icon"
                width={size}
                height={size}
                priority
            />
        </div>
    );
};

export default Loader;
