import express from "express";
import { createPost, createUser, getPosts, getUsers } from "../models";

const router = express.Router();

// Create User
router.post("/users", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await createUser(username, email, password);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Users
router.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Post
router.post("/posts", async (req, res) => {
  const { userId, url, caption } = req.body;
  try {
    const post = await createPost(userId, url, caption);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
