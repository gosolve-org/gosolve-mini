import Image from 'next/image';

const Logo = ({ className }: { className: string }) => {
    return (
        <Image
            className={className}
            src="/images/gosolve_logo.svg"
            alt="goSolve Logo"
            priority
            width={187}
            height={37}
        />
    );
};

export default Logo;
