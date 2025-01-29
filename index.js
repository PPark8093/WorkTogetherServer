const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const corsOptions = {
    origin: "*",  // 모든 출처를 허용, 필요에 따라 특정 도메인만 허용할 수도 있음
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // 허용할 HTTP 메소드 설정
    allowedHeaders: ["Content-Type", "Authorization"],  // 허용할 헤더 설정
    optionsSuccessStatus: 204  // OPTIONS 요청에 대한 응답 상태 코드 (204: No Content)
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

mongoose.connect(`mongodb+srv://parkjuwon8093:kSPAfa7NlpM0VvlK@worktogether.d531a.mongodb.net/?retryWrites=true&w=majority&appName=WorkTogether`)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    like: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now } // 언제 만들어졌는지
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
    const { _id, title, body, like } = req.body;
    try {
        let post;
        if (_id) {
            // 기존 게시글이면 업데이트 (좋아요 증가)
            post = await Post.findByIdAndUpdate(_id, { title, body, like }, { new: true });
        } else {
            // 새로운 게시글 추가
            post = new Post({ title, body, like: like || 0 });
            await post.save();
        }

        res.status(200).json(post);
    } catch (err) {
        console.error("Error saving post:", err);
        res.status(500).json({ error: "Failed to save post" });
    }
});

// app.listen(port, () => {
//     console.log("listening!");
// })
// Vercel은 app.listen 안씀(서버리스라서)
module.exports = app;