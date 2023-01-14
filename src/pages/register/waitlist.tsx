import Image from "next/image";

function Waitlist() {
	return (
		<main className="h-full">
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Image
						className="mx-auto h-18 w-auto"
						src="/images/gosolve_logo.svg"
						alt="goSolve Logo"
						width={180}
						height={37}
						priority
					/>
					<h1 className="mt-7 px-4 py-2 text-center text-xl font-small tracking-tight  text-black ">
						You&apos;re on the waitlist!
					</h1>
				</div>
			</div>
		</main>
	);
}

export default Waitlist;
