import Image from "next/image";

function Loader() {
	return (
		<div className="flex h-full w-full justify-center items-center">
			<Image
				className="mx-auto h-12 w- motion-safe:animate-spin"
				src="/favicon.png"
				alt="goSolve favicon"
				width={50}
				height={50}
				priority
			/>
		</div>
	);
}

export default Loader;
