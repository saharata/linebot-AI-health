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
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4";
const LIFF_ID = process.env.LIFF_ID || "";

// =========================
// HEALTH CHECK (สำคัญ)
// =========================
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    appsScriptConfigured: !!APPS_SCRIPT_URL,
    liffConfigured: !!LIFF_ID,
    openaiConfigured: !!OPENAI_API_KEY,
    model: OPENAI_MODEL
  });
});

// =========================
// CONFIG (ส่ง LIFF_ID ไปหน้าเว็บ)
// =========================
app.get("/api/config", (req, res) => {
  res.json({
    liffId: LIFF_ID
  });
});

// =========================
// DASHBOARD (เรียก Apps Script)
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
// AI SUMMARY (OpenAI)
// =========================
app.post("/api/ai-summary", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.json({
        ok: false,
        error: "OPENAI_API_KEY not set"
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

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: prompt
      })
    });

    const json = await response.json();

    const text =
      json.output?.[0]?.content?.[0]?.text ||
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
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});