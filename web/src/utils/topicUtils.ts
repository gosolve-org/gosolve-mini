import { Category } from "common/models/Category";
import { Location } from "common/models/Location";

export const isHomePage = (category: Category, location: Location) =>
    category?.category?.toLowerCase() === 'gosolve' && location?.location?.toLowerCase() === 'world';
