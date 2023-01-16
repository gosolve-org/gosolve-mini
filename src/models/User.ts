export interface User {
	email?: string;
	name?: string;
	username?: string;
	birthYear?: number;
	role?: "user" | "editor" | "admin";
	createdAt?: Date;
	updatedAt?: Date;
}
