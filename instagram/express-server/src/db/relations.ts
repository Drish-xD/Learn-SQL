import { relations } from "drizzle-orm/relations";
import {
	captionTags,
	comments,
	followers,
	hashtags,
	hashtagsPosts,
	likes,
	photoTags,
	posts,
	users,
} from "./schema";

export const postsRelations = relations(posts, ({ one, many }) => ({
	user: one(users, {
		fields: [posts.userId],
		references: [users.id],
	}),
	captionTags: many(captionTags),
	comments: many(comments),
	hashtagsPosts: many(hashtagsPosts),
	likes: many(likes),
	photoTags: many(photoTags),
}));

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	captionTags: many(captionTags),
	comments: many(comments),
	followers_followerId: many(followers, {
		relationName: "followers_followerId_users_id",
	}),
	followers_leaderId: many(followers, {
		relationName: "followers_leaderId_users_id",
	}),
	likes: many(likes),
	photoTags: many(photoTags),
}));

export const captionTagsRelations = relations(captionTags, ({ one }) => ({
	post: one(posts, {
		fields: [captionTags.postId],
		references: [posts.id],
	}),
	user: one(users, {
		fields: [captionTags.userId],
		references: [users.id],
	}),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
	likes: many(likes),
}));

export const followersRelations = relations(followers, ({ one }) => ({
	user_followerId: one(users, {
		fields: [followers.followerId],
		references: [users.id],
		relationName: "followers_followerId_users_id",
	}),
	user_leaderId: one(users, {
		fields: [followers.leaderId],
		references: [users.id],
		relationName: "followers_leaderId_users_id",
	}),
}));

export const hashtagsPostsRelations = relations(hashtagsPosts, ({ one }) => ({
	hashtag: one(hashtags, {
		fields: [hashtagsPosts.hashtagId],
		references: [hashtags.id],
	}),
	post: one(posts, {
		fields: [hashtagsPosts.postId],
		references: [posts.id],
	}),
}));

export const hashtagsRelations = relations(hashtags, ({ many }) => ({
	hashtagsPosts: many(hashtagsPosts),
}));

export const likesRelations = relations(likes, ({ one }) => ({
	comment: one(comments, {
		fields: [likes.commentId],
		references: [comments.id],
	}),
	post: one(posts, {
		fields: [likes.postId],
		references: [posts.id],
	}),
	user: one(users, {
		fields: [likes.userId],
		references: [users.id],
	}),
}));

export const photoTagsRelations = relations(photoTags, ({ one }) => ({
	post: one(posts, {
		fields: [photoTags.postId],
		references: [posts.id],
	}),
	user: one(users, {
		fields: [photoTags.userId],
		references: [users.id],
	}),
}));
