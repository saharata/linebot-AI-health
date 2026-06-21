require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";
const LIFF_ID = process.env.LIFF_ID || "";

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "";
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M2.7";
const MINIMAX_BASE_URL =
  process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1/chat/completions";

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

app.get("/api/config", (req, res) => {
  res.json({
    liffId: LIFF_ID
  });
});

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
นี่คือข้อมูลสุขภาพของผู้ใช้ (รูปแบบ JSON):

${JSON.stringify(dashboard, null, 2)}

ช่วยสรุปให้ผู้ใช้เข้าใจง่าย โดยจัดรูปแบบดังนี้:

📊 ภาพรวมสุขภาพ
- สรุปภาพรวมสั้น ๆ 1-2 บรรทัด

📈 แนวโน้มที่น่าสนใจ
- จุดที่ดีขึ้นหรือแย่ลง (ถ้ามีข้อมูลย้อนหลัง)

⚠️ สิ่งที่ควรติดตาม
- ค่าหรือพฤติกรรมที่ควรเฝ้าระวัง พร้อมคำแนะนำเบื้องต้น

ข้อกำหนด:
- รวมทั้งหมดไม่เกิน 5 หัวข้อย่อย (bullet)
- ใช้เฉพาะข้อมูลที่ให้มา ถ้าส่วนไหนว่างหรือไม่มี ให้บอกว่า "ยังไม่มีข้อมูลส่วนนี้" แทนการเดา
- ถ้าพบค่าที่ผิดปกติชัดเจน ให้เตือนอย่างสุภาพว่าควรปรึกษาแพทย์ ไม่ฟันธงว่าเป็นโรคอะไร
- ปิดท้ายด้วยประโยคให้กำลังใจสั้น ๆ 1 บรรทัด
`;

    const response = await fetch(MINIMAX_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MINIMAX_MODEL,
        messages: [
          {
            role: "system",
            content:
              "คุณเป็นผู้ช่วยสรุปข้อมูลสุขภาพสำหรับคนทั่วไป หน้าที่คืออ่านข้อมูลสุขภาพที่ให้มาแล้วสรุปเป็นภาษาไทยที่เข้าใจง่าย กระชับ และให้กำลังใจ\n\nหลักการสำคัญ:\n- ใช้เฉพาะข้อมูลที่ให้มาเท่านั้น ห้ามเดาหรือสมมติค่าที่ไม่มี\n- ไม่วินิจฉัยโรค ไม่สั่งยา ไม่ฟันธงว่าเป็นโรคอะไร\n- ถ้าพบค่าที่ผิดปกติหรือน่ากังวล ให้แนะนำอย่างสุภาพว่าควรปรึกษาแพทย์หรือผู้เชี่ยวชาญ\n- ใช้ภาษาเชิงบวก ให้กำลังใจ ไม่ทำให้ผู้ใช้ตกใจ\n- ตอบเป็นภาษาไทยเท่านั้น หลีกเลี่ยงศัพท์แพทย์ที่เข้าใจยาก ถ้าจำเป็นต้องใช้ให้อธิบายสั้น ๆ"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
        stream: false
      })
    });

    const json = await response.json();

    console.log("MiniMax status:", response.status);
    console.log("MiniMax response:", JSON.stringify(json));

    if (!response.ok) {
      return res.json({
        ok: false,
        error: "MiniMax API error",
        status: response.status,
        detail: json
      });
    }

    const text =
      json.choices?.[0]?.message?.content ||
      json.choices?.[0]?.delta?.content ||
      json.output_text ||
      json.reply ||
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

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
