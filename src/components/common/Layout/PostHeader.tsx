import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

function PostHeader() {
	const router = useRouter();

	const categoryQuery = router?.query?.category
		? router?.query?.category.toString()
		: "...";
	const locationQuery = router?.query?.location
		? router?.query?.location.toString()
		: "...";

	const readableCategory = categoryQuery.split("-").join(" ");
	const readableLocation = locationQuery.split("-").join(" ");

	return (
		<div className="flex flex-col justify-center items-center ">
			<div className="w-full max-w-4xl">
				<div className="mt-6 w-full flex justify-start items-center text-gray-500 text-sm">
					<Link href={`/${categoryQuery}/${locationQuery}`}>
						<ArrowLeftIcon
							className="h-4 w-4 inline-block items-center mr-1"
							aria-hidden="true"
						/>
						{`Back to ${readableCategory} in ${readableLocation}`}
					</Link>
				</div>
			</div>
		</div>
	);
}

export default PostHeader;
