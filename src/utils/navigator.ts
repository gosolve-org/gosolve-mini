import { NextRouter } from "next/router";
import { toUrlPart } from "./textUtils";

export const goToTopicPage = async (
    router: NextRouter,
    category: string,
    location: string
) => {
    await router.push(
        `/${toUrlPart(category)}/${toUrlPart(location)}`
    );
};

export const goToSearch = async (
    router: NextRouter,
    query: string,
    category?: string,
    location?: string
) => {
    let path = `/search?q=${encodeURIComponent(query)}`;
    if (category) {
        path += `&category=${toUrlPart(category)}`;
    }
    if (location) {
        path += `&location=${toUrlPart(location)}`;
    }
    await router.push(path);
}
