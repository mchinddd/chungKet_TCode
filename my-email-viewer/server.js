const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const API_KEY = process.env.GOOGLE_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// Regex để phân loại trên server
const spamRegex = [
  /GIẢM GIÁ.*[0-9]{2,}%/i,
  /CHỈ.*HÔM NAY/i,
  /KHUYẾN MÃI.*KHỦNG/i,
  /[💰🎉🔥⭐💯]/u,
  /!!!/,
  /\$\$\$/,
  /CLICK.*NGAY/i,
];
const dangerRegex = [
  /bảo mật|security|alert/i,
  /tài khoản.*bị.*khóa|suspended|compromised/i,
  /xác (minh|nhận|thực).*khẩn|verify|confirm/i,
  /cập nhật.*ngay|update now/i,
  /hoạt động đáng ngờ/i,
  /thông báo thanh toán/i,
  /amaz[0o]n|g[0o]{2}gle|micr[0o]soft|payp[a@]l|faceb[0o]{2}k/i,
];
const junkRegex = [/quảng cáo/i, /sale/i, /dịch vụ/i, /ưu đãi/i];

function classifyEmail(email) {
  const text = (email.title + " " + (email.content || "")).toLowerCase();
  if (spamRegex.some((r) => r.test(text))) return "spam";
  if (dangerRegex.some((r) => r.test(text))) return "danger";
  if (junkRegex.some((r) => r.test(text))) return "junk";
  return "safe";
}

// API mới để phân loại tất cả email
app.get("/emails/classify", (req, res) => {
  db.query("SELECT * FROM incoming_emails", (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });

    const groups = { safe: [], junk: [], spam: [], danger: [] };
    results.forEach((email) => {
      const cat = classifyEmail(email);
      groups[cat].push(email);
    });

    const counts = {
      safe: groups.safe.length,
      junk: groups.junk.length,
      spam: groups.spam.length,
      danger: groups.danger.length,
    };

    res.json({ counts, data: groups });
  });
});

app.get("/emails/classify/:type", (req, res) => {
  const type = req.params.type;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT * FROM incoming_emails LIMIT ? OFFSET ?",
    [limit, offset],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      const filtered = results.filter((email) => classifyEmail(email) === type);
      res.json(filtered);
    }
  );
});

// Endpoint bảo mật
app.post("/chatbot", express.json(), async (req, res) => {
  try {
    const conversationHistory = req.body.conversationHistory || [];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: conversationHistory,
          systemInstruction: {
            parts: [
              {
                text: `Bạn là trợ lý ảo của Web ABC chuyên về kiểm tra an toàn Gmail. 
Nhiệm vụ của bạn là cung cấp thông tin chính xác về các loại email (an toàn, spam, giả mạo, nghi ngờ) và đưa ra lời khuyên bảo mật cho người dùng. 
Bạn cũng có thể trả lời các câu hỏi tổng quát về an toàn mạng, email, và cách bảo vệ tài khoản. 
Luôn lịch sự, chuyên nghiệp, ngắn gọn. 
**QUAN TRỌNG:** Luôn sử dụng định dạng Markdown để trình bày câu trả lời sao cho dễ đọc và đẹp mắt.`,
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Google API Error" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API phân trang (không đổi)
app.get("/emails", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const offset = (page - 1) * limit;

  const sql = `SELECT * FROM incoming_emails ORDER BY received_time DESC LIMIT ? OFFSET ?`;
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      console.error("❌ Lỗi truy vấn:", err);
      res.status(500).json({ error: "DB error" });
    } else {
      res.json(results);
    }
  });
});

// WebSocket như cũ
io.on("connection", (socket) => {
  console.log("📡 Client đã kết nối");

  let lastEmailId = null;

  const checkNewEmail = () => {
    db.query(
      "SELECT * FROM incoming_emails ORDER BY received_time DESC LIMIT 1",
      (err, result) => {
        if (!err && result.length > 0) {
          const latest = result[0];
          if (latest.id !== lastEmailId) {
            lastEmailId = latest.id;
            socket.emit("new_email", latest);
          }
        }
      }
    );
  };

  checkNewEmail();
  const intervalId = setInterval(checkNewEmail, 10000);

  socket.on("disconnect", () => {
    console.log("❌ Client đã ngắt kết nối");
    clearInterval(intervalId);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
