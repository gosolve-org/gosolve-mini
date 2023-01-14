import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "styles/Home.module.css";

import { useAuth } from "context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const { logout } = useAuth();

	const handleLogoutClick = () => logout();

	return (
		<>
			<Head>
				<title>goSolve</title>
				<meta name="description" content="goSolve home" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<div className={styles.center}>
					<Image
						src="/images/gosolve_logo.svg"
						alt="goSolve Logo"
						width={180}
						height={37}
						priority
					/>
				</div>
				<div>
					<button
						onClick={handleLogoutClick}
						className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Logout
					</button>
				</div>
			</main>
		</>
	);
}
