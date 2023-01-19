export interface Action {
	id?: string;
	title?: string;
	content?: string;
	location?: string;
	topicId?: string;
	authorId?: string;
	authorUsername?: string;
	updatedAt?: Date;
	createdAt?: Date;
}
