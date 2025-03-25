import db from "../db";
import { posts, users } from "../db/schema";

// Create a user
export const createUser = async (
	username: string,
	email: string,
	password: string,
) => {
	const result = await db
		.insert(users)
		.values({ username, email, password })
		.returning();

	return result;
};

// Get all users
export const getUsers = async () => {
	const results = await db.query.users.findMany();

	return results;
};

// Create a post
export const createPost = async (
	userId: number,
	url: string,
	caption?: string,
) => {
	const result = await db
		.insert(posts)
		.values({ userId, url, caption })
		.returning();

	return result;
};

// Get posts
export const getPosts = async () => {
	const results = await db.query.posts.findMany();
  
	return results;
};
