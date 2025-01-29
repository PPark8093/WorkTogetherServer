const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const app = express();
const port = 8093;

dotenv.config();

app.use(cors());
app.use(express.json());

const db_password = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://parkjuwon8093:${db_password}@worktogether.d531a.mongodb.net/?retryWrites=true&w=majority&appName=WorkTogether`)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

app.get("/posts", async (req, res) => { // 게시글 돌라는 요청이 들어왔을 때
    try {
        const posts = await Post.find(); // MongoDB에서 모든 게시글 조회
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

app.post("/posts", async (req, res) => {
    const { title, body } = req.body;
    try {
        const newPost = new Post({ title, body }); // 새로운 게시글 생성
        const savedPost = await newPost.save(); // MongoDB에 저장
        res.status(201).json(savedPost);
    } catch (err) {
        console.error("Error saving post:", err);
        res.status(500).json({ error: "Failed to save post" });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;