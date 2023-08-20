import { Category } from "models/Category";
import { Location } from "models/Location";

export const isHomePage = (category: Category, location: Location) =>
    category?.category?.toLowerCase() === 'gosolve' && location?.location?.toLowerCase() === 'world';
