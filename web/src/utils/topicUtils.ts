import { type Category } from 'common/models/Category';
import { type Location } from 'common/models/Location';

export const isHomePage = (category: Category, location: Location) =>
    category?.category?.toLowerCase() === 'gosolve' &&
    location?.location?.toLowerCase() === 'world';
