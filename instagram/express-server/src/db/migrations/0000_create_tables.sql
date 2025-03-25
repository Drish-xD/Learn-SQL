--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"url" varchar(200) NOT NULL,
	"caption" varchar(240),
	"lat" real,
	"lng" real,
	"user_id" integer NOT NULL,
	CONSTRAINT "posts_lat_check" CHECK ((lat IS NULL) OR ((lat >= ('-90'::integer)::double precision) AND (lat <= (90)::double precision))),
	CONSTRAINT "posts_lng_check" CHECK ((lng IS NULL) OR ((lng >= ('-180'::integer)::double precision) AND (lng <= (180)::double precision)))
);
--> statement-breakpoint
CREATE TABLE "caption_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "caption_tags_user_id_post_id_key" UNIQUE("user_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"username" varchar(30) NOT NULL,
	"bio" varchar(400),
	"avatar" varchar(200),
	"phone" varchar(25),
	"email" varchar(40),
	"password" varchar(50),
	"status" varchar(15),
	CONSTRAINT "users_check" CHECK (COALESCE(phone, email) IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"contents" varchar(240) NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"leader_id" integer NOT NULL,
	"follower_id" integer NOT NULL,
	CONSTRAINT "followers_leader_id_follower_id_key" UNIQUE("leader_id","follower_id")
);
--> statement-breakpoint
CREATE TABLE "hashtags" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"title" varchar(20) NOT NULL,
	CONSTRAINT "hashtags_title_key" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "hashtags_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"hashtag_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "hashtags_posts_hashtag_id_post_id_key" UNIQUE("hashtag_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_id" integer NOT NULL,
	"post_id" integer,
	"comment_id" integer,
	CONSTRAINT "likes_user_id_post_id_comment_id_key" UNIQUE("user_id","post_id","comment_id"),
	CONSTRAINT "likes_check" CHECK ((COALESCE(((post_id)::boolean)::integer, 0) + COALESCE(((comment_id)::boolean)::integer, 0)) = 1)
);
--> statement-breakpoint
CREATE TABLE "photo_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	CONSTRAINT "photo_tags_user_id_post_id_key" UNIQUE("user_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caption_tags" ADD CONSTRAINT "caption_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caption_tags" ADD CONSTRAINT "caption_tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hashtags_posts" ADD CONSTRAINT "hashtags_posts_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "public"."hashtags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hashtags_posts" ADD CONSTRAINT "hashtags_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_tags" ADD CONSTRAINT "photo_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_tags" ADD CONSTRAINT "photo_tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" USING btree ("username" text_ops);--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."weekly_likes" AS (SELECT date_trunc('week'::text, COALESCE(p.created_at, c.created_at)) AS week, count(p.id) AS posts_likes, count(c.id) AS comments_likes FROM likes l LEFT JOIN posts p ON p.id = l.post_id LEFT JOIN comments c ON l.comment_id = c.id GROUP BY (date_trunc('week'::text, COALESCE(p.created_at, c.created_at))) ORDER BY (date_trunc('week'::text, COALESCE(p.created_at, c.created_at))));--> statement-breakpoint
CREATE VIEW "public"."tags" AS (SELECT photo_tags.id, photo_tags.created_at, photo_tags.user_id, photo_tags.post_id, 'photo'::text AS type FROM photo_tags UNION ALL SELECT caption_tags.id, caption_tags.created_at, caption_tags.user_id, caption_tags.post_id, 'caption'::text AS type FROM caption_tags);--> statement-breakpoint
CREATE VIEW "public"."recent_posts" AS (SELECT id, created_at, updated_at, url, caption, lat, lng, user_id FROM posts ORDER BY created_at DESC LIMIT 15);
