require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// =========================
// ENV
// =========================
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";
const LIFF_ID = process.env.LIFF_ID || "";

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "";
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "abab6.5s-chat";
const MINIMAX_BASE_URL =
  process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1/text/chatcompletion_v2";

// =========================
// HEALTH CHECK
// =========================
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    appsScriptConfigured: !!APPS_SCRIPT_URL,
    liffConfigured: !!LIFF_ID,
    minimaxConfigured: !!MINIMAX_API_KEY,
    model: MINIMAX_MODEL,
    minimaxBaseUrl: MINIMAX_BASE_URL
  });
});

// =========================
// CONFIG
// =========================
app.get("/api/config", (req, res) => {
  res.json({
    liffId: LIFF_ID
  });
});

// =========================
// DASHBOARD
// =========================
app.get("/api/dashboard", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.json({ ok: false, error: "Missing userId" });
    }

    if (!APPS_SCRIPT_URL) {
      return res.json({ ok: false, error: "APPS_SCRIPT_URL not set" });
    }

    const url = `${APPS_SCRIPT_URL}?mode=dashboard&userId=${encodeURIComponent(userId)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.json({
      ok: false,
      error: err.message
    });
  }
});

// =========================
// AI SUMMARY - MINIMAX ONLY
// =========================
app.post("/api/ai-summary", async (req, res) => {
  try {
    if (!MINIMAX_API_KEY) {
      return res.json({
        ok: false,
        error: "MINIMAX_API_KEY not set"
      });
    }

    const dashboard = req.body;

    const prompt = `
คุณคือแพทย์ระบบประสาท
ช่วยสรุปข้อมูลสุขภาพนี้เป็นภาษาไทยแบบเข้าใจง่าย:

${JSON.stringify(dashboard, null, 2)}

สรุป:
- ภาพรวมสุขภาพ
- แนวโน้ม
- สิ่งที่ควรติดตาม
- ไม่เกิน 5 bullet
- ไม่ใช้ศัพท์ยาก
`;

    const response = await fetch(MINIMAX_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MINIMAX_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MINIMAX_MODEL,
        messages: [
          {
            role: "system",
            content: "คุณเป็นผู้ช่วยแพทย์ที่สรุปข้อมูลสุขภาพให้คนทั่วไปเข้าใจง่าย"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        stream: false
      })
    });

    const json = await response.json();

    if (!response.ok) {
      return res.json({
        ok: false,
        error: "MiniMax API error",
        detail: json
      });
    }

    const text =
      json.choices?.[0]?.message?.content ||
      json.reply ||
      json.output_text ||
      "AI ไม่สามารถสรุปได้";

    res.json({
      ok: true,
      text
    });

  } catch (err) {
    res.json({
      ok: false,
      error: err.message
    });
  }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
