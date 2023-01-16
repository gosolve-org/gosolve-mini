import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "styles/Home.module.css";

import { Layout, Loader } from "components/common";
import { useAuth } from "context/AuthContext";
import { DEFAULT_SEARCH } from "constants/defaultSearches";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const { logout, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user) router.push(DEFAULT_SEARCH);
	});

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
			<Layout>
				<main className={styles.main}>
					<Loader />
				</main>
			</Layout>
		</>
	);
}
