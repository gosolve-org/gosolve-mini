import { useMediaQueries } from "common/contexts/MediaQueryContext";
import Image from "next/image";

function ResponsiveLogo({ className }: { className: string }) {
    const { isDesktopOrLaptop } = useMediaQueries();

    return (
        <>
            {
                isDesktopOrLaptop
                    ? <Image
                        className={className}
                        src="/images/gosolve_logo.svg"
                        alt="goSolve Logo"
                        priority
                        width={187}
                        height={37}
                    />
                    : <Image
                        className={className}
                        src="/images/gosolve_mini_logo_compact.svg"
                        alt="goSolve Logo"
                        priority
                        width={89}
                        height={37}
                    />
            }
        </>
    );
}

export default ResponsiveLogo;
