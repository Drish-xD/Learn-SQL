import { sql } from "drizzle-orm";
import {
	bigint,
	check,
	foreignKey,
	index,
	integer,
	pgEnum,
	pgMaterializedView,
	pgTable,
	pgView,
	real,
	serial,
	text,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";

export const userStatus = pgEnum("user_status", ["active", "inactive"]);

export const users = pgTable(
	"users",
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		updatedAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		username: varchar({ length: 30 }).notNull().unique(),
		bio: varchar({ length: 400 }),
		avatar: varchar({ length: 200 }),
		phone: varchar({ length: 25 }),
		email: varchar({ length: 40 }).unique(),
		password: varchar({ length: 50 }),
		status: userStatus().default("active"),
	},
	(table) => [
		index("users_username_idx").using(
			"btree",
			table.username.asc().nullsLast().op("text_ops"),
		),
		check("users_check", sql`COALESCE(phone, email) IS NOT NULL`),
	],
);

export const posts = pgTable(
	"posts",
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		updatedAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		url: varchar({ length: 200 }).notNull(),
		caption: varchar({ length: 240 }),
		lat: real(),
		lng: real(),
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "posts_user_id_fkey",
		}).onDelete("cascade"),
		check(
			"posts_lat_check",
			sql`(lat IS NULL) OR ((lat >= ('-90'::integer)::double precision) AND (lat <= (90)::double precision))`,
		),
		check(
			"posts_lng_check",
			sql`(lng IS NULL) OR ((lng >= ('-180'::integer)::double precision) AND (lng <= (180)::double precision))`,
		),
	],
);

export const captionTags = pgTable(
	"caption_tags",
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		postId: integer()
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
	},
	(table) => [
		foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "caption_tags_post_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "caption_tags_user_id_fkey",
		}).onDelete("cascade"),
		unique("caption_tags_user_id_post_id_key").on(table.userId, table.postId),
	],
);

export const comments = pgTable(
	"comments",
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		updatedAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		contents: varchar({ length: 240 }).notNull(),
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		postId: integer()
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
	},
	(table) => [
		foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "comments_post_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "comments_user_id_fkey",
		}).onDelete("cascade"),
	],
);

export const followers = pgTable(
	"followers",
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		leaderId: integer("leader_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		followerId: integer("follower_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	(table) => [
		foreignKey({
			columns: [table.followerId],
			foreignColumns: [users.id],
			name: "followers_follower_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.leaderId],
			foreignColumns: [users.id],
			name: "followers_leader_id_fkey",
		}).onDelete("cascade"),
		unique("followers_leader_id_follower_id_key").on(
			table.leaderId,
			table.followerId,
		),
	],
);

export const hashtags = pgTable(
	"hashtags",
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		title: varchar({ length: 20 }).notNull().unique(),
	},
	(table) => [unique("hashtags_title_key").on(table.title)],
);

export const hashtagsPosts = pgTable(
	"hashtags_posts",
	{
		id: serial().primaryKey().notNull(),
		hashtagId: integer("hashtag_id")
			.notNull()
			.references(() => hashtags.id, { onDelete: "cascade" }),
		postId: integer("post_id")
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
	},
	(table) => [
		foreignKey({
			columns: [table.hashtagId],
			foreignColumns: [hashtags.id],
			name: "hashtags_posts_hashtag_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "hashtags_posts_post_id_fkey",
		}).onDelete("cascade"),
		unique("hashtags_posts_hashtag_id_post_id_key").on(
			table.hashtagId,
			table.postId,
		),
	],
);

export const likes = pgTable(
	"likes",
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		postId: integer().references(() => posts.id, { onDelete: "cascade" }),
		commentId: integer().references(() => comments.id, { onDelete: "cascade" }),
	},
	(table) => [
		foreignKey({
			columns: [table.commentId],
			foreignColumns: [comments.id],
			name: "likes_comment_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "likes_post_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "likes_user_id_fkey",
		}).onDelete("cascade"),
		unique("likes_user_id_post_id_comment_id_key").on(
			table.userId,
			table.postId,
			table.commentId,
		),
		check(
			"likes_check",
			sql`(COALESCE(((post_id)::boolean)::integer, 0) + COALESCE(((comment_id)::boolean)::integer, 0)) = 1`,
		),
	],
);

export const photoTags = pgTable(
	"photo_tags",
	{
		id: serial().primaryKey().notNull(),
		createdAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		updatedAt: timestamp({
			withTimezone: true,
			mode: "string",
		})
			.defaultNow()
			.notNull(),
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		postId: integer()
			.notNull()
			.references(() => posts.id, { onDelete: "cascade" }),
		x: integer().notNull(),
		y: integer().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "photo_tags_post_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "photo_tags_user_id_fkey",
		}).onDelete("cascade"),
		unique("photo_tags_user_id_post_id_key").on(table.userId, table.postId),
	],
);
export const weeklyLikes = pgMaterializedView("weekly_likes", {
	week: timestamp({ withTimezone: true, mode: "string" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	postsLikes: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	commentsLikes: bigint({ mode: "number" }),
}).as(
	sql`SELECT date_trunc('week'::text, COALESCE(p.created_at, c.created_at)) AS week, count(p.id) AS posts_likes, count(c.id) AS comments_likes FROM likes l LEFT JOIN posts p ON p.id = l.post_id LEFT JOIN comments c ON l.comment_id = c.id GROUP BY (date_trunc('week'::text, COALESCE(p.created_at, c.created_at))) ORDER BY (date_trunc('week'::text, COALESCE(p.created_at, c.created_at)))`,
);

export const tags = pgView("tags", {
	id: serial().primaryKey().notNull(),
	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	})
		.defaultNow()
		.notNull(),
	userId: integer()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	postId: integer()
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	type: text(),
}).as(
	sql`SELECT photo_tags.id, photo_tags.created_at, photo_tags.user_id, photo_tags.post_id, 'photo'::text AS type FROM photo_tags UNION ALL SELECT caption_tags.id, caption_tags.created_at, caption_tags.user_id, caption_tags.post_id, 'caption'::text AS type FROM caption_tags`,
);

export const recentPosts = pgView("recent_posts", {
	id: serial().primaryKey().notNull(),
	createdAt: timestamp({
		withTimezone: true,
		mode: "string",
	})
		.defaultNow()
		.notNull(),
	updatedAt: timestamp({
		withTimezone: true,
		mode: "string",
	})
		.defaultNow()
		.notNull(),
	url: varchar({ length: 200 }),
	caption: varchar({ length: 240 }),
	lat: real(),
	lng: real(),
	userId: integer()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
}).as(
	sql`SELECT id, created_at, updated_at, url, caption, lat, lng, user_id FROM posts ORDER BY created_at DESC LIMIT 15`,
);
