import pool from "../db";

// Create a user
export const createUser = async (username: string, email: string, password: string) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
};

// Get all users
export const getUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

// Create a post
export const createPost = async (userId: number, url: string, caption?: string) => {
  const result = await pool.query(
    "INSERT INTO posts (user_id, url, caption) VALUES ($1, $2, $3) RETURNING *",
    [userId, url, caption]
  );
  return result.rows[0];
};

// Get posts
export const getPosts = async () => {
  const result = await pool.query("SELECT * FROM posts");
  return result.rows;
};
