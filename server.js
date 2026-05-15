require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const OpenAI = require("openai");
const { google } = require("googleapis");

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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const LINE_PAY_CHANNEL_ID = process.env.LINE_PAY_CHANNEL_ID || "";
const LINE_PAY_CHANNEL_SECRET = process.env.LINE_PAY_CHANNEL_SECRET || "";
const LINE_PAY_BASE_URL =
  process.env.LINE_PAY_BASE_URL || "https://sandbox-api-pay.line.me";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
const GOOGLE_SA_EMAIL = process.env.GOOGLE_SA_EMAIL || "";
const GOOGLE_SA_PRIVATE_KEY = (process.env.GOOGLE_SA_PRIVATE_KEY || "").replace(
  /\\n/g,
  "\n"
);

function getCalendarClient() {
  if (!GOOGLE_SA_EMAIL || !GOOGLE_SA_PRIVATE_KEY) return null;
  const auth = new google.auth.JWT(GOOGLE_SA_EMAIL, null, GOOGLE_SA_PRIVATE_KEY, [
    "https://www.googleapis.com/auth/calendar"
  ]);
  return google.calendar({ version: "v3", auth });
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    appsScriptConfigured: !!APPS_SCRIPT_URL,
    liffConfigured: !!LIFF_ID,
    minimaxConfigured: !!MINIMAX_API_KEY,
    openaiConfigured: !!OPENAI_API_KEY,
    linePayConfigured: !!(LINE_PAY_CHANNEL_ID && LINE_PAY_CHANNEL_SECRET),
    googleCalendarConfigured: !!(GOOGLE_SA_EMAIL && GOOGLE_SA_PRIVATE_KEY),
    model: MINIMAX_MODEL,
    openaiModel: OPENAI_MODEL
  });
});

app.get("/api/config", (req, res) => {
  res.json({ liffId: LIFF_ID });
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.json({ ok: false, error: "Missing userId" });
    if (!APPS_SCRIPT_URL) return res.json({ ok: false, error: "APPS_SCRIPT_URL not set" });

    const url = `${APPS_SCRIPT_URL}?mode=dashboard&userId=${encodeURIComponent(userId)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.post("/api/ai-summary", async (req, res) => {
  try {
    if (!MINIMAX_API_KEY) {
      return res.json({ ok: false, error: "MINIMAX_API_KEY not set" });
    }

    const dashboard = req.body;

    const prompt = `
คุณคือแพทย์ระบบประสาท
ช่วยสรุปข้อมูลสุขภาพนี้เป็นภาษาไทยแบบเข้าใจง่าย:

${JSON.stringify(dashboard, null, 2)}

ขอรูปแบบ:
- ภาพรวมสุขภาพ
- แนวโน้ม
- สิ่งที่ควรติดตาม
- ไม่เกิน 5 bullet
- ไม่ใช้ศัพท์ยาก
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
              "คุณเป็นผู้ช่วยแพทย์ ช่วยสรุปข้อมูลสุขภาพให้คนทั่วไปเข้าใจง่าย กระชับ และไม่วินิจฉัยเกินข้อมูล ตอบภาษาไทยเท่านั้น"
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
        stream: false
      })
    });

    const json = await response.json();

    if (!response.ok) {
      return res.json({ ok: false, error: "MiniMax API error", status: response.status, detail: json });
    }

    const text =
      json.choices?.[0]?.message?.content ||
      json.choices?.[0]?.delta?.content ||
      json.output_text ||
      json.reply ||
      "AI ไม่สามารถสรุปได้";

    res.json({ ok: true, text });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

const SYMPTOM_CHECK_SYSTEM_PROMPT = `คุณเป็นผู้ช่วยแพทย์ระบบประสาทเฉพาะทาง headache + vestibular + functional disorder
ภารกิจ: ประเมิน screening จากคำตอบของผู้ป่วยตามเกณฑ์ ICHD-3, Bárány Society PPPD criteria, FND screen และ SNOOP red flag

ข้อบังคับสำคัญ:
1. ห้ามให้คำวินิจฉัย (diagnosis) - ใช้คำว่า "อาจเข้าข่าย" / "มีลักษณะที่ควรประเมินเพิ่ม"
2. ห้ามสั่งยา / บอก dose / บอกชื่อยาเฉพาะเจาะจง
3. ถ้าพบ red flag (SNOOP) - ต้องแนะนำ ER ทันที
4. ใช้ภาษาไทยเข้าใจง่าย ไม่ใช้ศัพท์แพทย์ยากเกินไป
5. ต้องอ่อนโยน เห็นใจ และให้ความหวัง

ตอบเป็น JSON เท่านั้น ตาม schema:
{
  "riskLevel": "HIGH" | "MEDIUM" | "LOW",
  "redFlags": [string],
  "possibleConditions": [{"condition": string, "thaiName": string, "matchScore": 0-100, "rationale": string}],
  "recommendation": "ER_NOW" | "BOOK_CONSULT" | "EDUCATION",
  "patientMessage": string (ภาษาไทย อ่อนโยน 3-5 ประโยค),
  "doctorNote": string (สำหรับหมออ่านก่อน consult - bullet points สั้น)
}`;

app.post("/api/symptom-check", async (req, res) => {
  try {
    if (!openai) {
      return res.json({ ok: false, error: "OPENAI_API_KEY not set" });
    }

    const { answers, userId } = req.body || {};
    if (!answers) return res.json({ ok: false, error: "Missing answers" });

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYMPTOM_CHECK_SYSTEM_PROMPT },
        {
          role: "user",
          content: `ข้อมูลผู้ป่วย (LINE userId: ${userId || "anonymous"}):
${JSON.stringify(answers, null, 2)}

วิเคราะห์และตอบ JSON เท่านั้น`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    let analysis;
    try {
      analysis = JSON.parse(raw);
    } catch {
      analysis = { riskLevel: "MEDIUM", patientMessage: raw };
    }

    const reportId = uuidv4();
    res.json({ ok: true, reportId, analysis });
  } catch (err) {
    console.error("symptom-check error:", err);
    res.json({ ok: false, error: err.message });
  }
});

app.get("/api/booking/slots", async (req, res) => {
  try {
    const cal = getCalendarClient();
    if (!cal) return res.json({ ok: false, error: "Google Calendar not configured" });

    const daysAhead = parseInt(req.query.days || "14", 10);
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000).toISOString();

    const busy = await cal.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: "Asia/Bangkok",
        items: [{ id: GOOGLE_CALENDAR_ID }]
      }
    });

    const busyRanges = busy.data.calendars?.[GOOGLE_CALENDAR_ID]?.busy || [];

    const slots = [];
    for (let d = 0; d < daysAhead; d++) {
      const day = new Date(now);
      day.setDate(day.getDate() + d);
      const dow = day.getDay();
      if (dow !== 0 && dow !== 6) continue;

      for (let h = 9; h < 16; h++) {
        for (let m = 0; m < 60; m += 10) {
          const start = new Date(day);
          start.setHours(h, m, 0, 0);
          const end = new Date(start.getTime() + 5 * 60 * 1000);
          if (start < now) continue;

          const overlap = busyRanges.some(b => {
            const bs = new Date(b.start);
            const be = new Date(b.end);
            return start < be && end > bs;
          });
          if (!overlap) {
            slots.push({ start: start.toISOString(), end: end.toISOString() });
          }
        }
      }
    }

    res.json({ ok: true, slots });
  } catch (err) {
    console.error("slots error:", err);
    res.json({ ok: false, error: err.message });
  }
});

app.post("/api/booking/create", async (req, res) => {
  try {
    const cal = getCalendarClient();
    if (!cal) return res.json({ ok: false, error: "Google Calendar not configured" });

    const { start, end, patientName, patientLineId, reportId, contact } = req.body || {};
    if (!start || !end) return res.json({ ok: false, error: "Missing time" });

    const event = await cal.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `5-min screen: ${patientName || patientLineId || "patient"}`,
        description: `Patient LINE: ${patientLineId || "-"}\nContact: ${contact || "-"}\nReport: ${reportId || "-"}`,
        start: { dateTime: start, timeZone: "Asia/Bangkok" },
        end: { dateTime: end, timeZone: "Asia/Bangkok" }
      }
    });

    res.json({ ok: true, eventId: event.data.id, htmlLink: event.data.htmlLink });
  } catch (err) {
    console.error("booking error:", err);
    res.json({ ok: false, error: err.message });
  }
});

function linePaySign(uri, body, nonce) {
  const message = LINE_PAY_CHANNEL_SECRET + uri + JSON.stringify(body) + nonce;
  return crypto.createHmac("sha256", LINE_PAY_CHANNEL_SECRET).update(message).digest("base64");
}

app.post("/api/payment/create", async (req, res) => {
  try {
    if (!LINE_PAY_CHANNEL_ID || !LINE_PAY_CHANNEL_SECRET) {
      return res.json({ ok: false, error: "LINE Pay not configured" });
    }

    const { amount = 499, productName = "5-min screening consult", orderId = uuidv4() } = req.body || {};

    const uri = "/v3/payments/request";
    const body = {
      amount,
      currency: "THB",
      orderId,
      packages: [
        {
          id: orderId,
          amount,
          name: productName,
          products: [{ name: productName, quantity: 1, price: amount }]
        }
      ],
      redirectUrls: {
        confirmUrl: `${APP_BASE_URL}/api/payment/confirm`,
        cancelUrl: `${APP_BASE_URL}/payment-cancel.html`
      }
    };

    const nonce = uuidv4();
    const signature = linePaySign(uri, body, nonce);

    const response = await fetch(`${LINE_PAY_BASE_URL}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-LINE-ChannelId": LINE_PAY_CHANNEL_ID,
        "X-LINE-Authorization-Nonce": nonce,
        "X-LINE-Authorization": signature
      },
      body: JSON.stringify(body)
    });
    const json = await response.json();

    if (json.returnCode !== "0000") {
      return res.json({ ok: false, error: json.returnMessage, detail: json });
    }
    res.json({ ok: true, orderId, paymentUrl: json.info?.paymentUrl?.web, transactionId: json.info?.transactionId });
  } catch (err) {
    console.error("payment create error:", err);
    res.json({ ok: false, error: err.message });
  }
});

app.get("/api/payment/confirm", async (req, res) => {
  try {
    const { transactionId, orderId } = req.query;
    if (!transactionId) return res.status(400).send("Missing transactionId");

    const uri = `/v3/payments/${transactionId}/confirm`;
    const body = { amount: parseInt(req.query.amount || "499", 10), currency: "THB" };
    const nonce = uuidv4();
    const signature = linePaySign(uri, body, nonce);

    const response = await fetch(`${LINE_PAY_BASE_URL}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-LINE-ChannelId": LINE_PAY_CHANNEL_ID,
        "X-LINE-Authorization-Nonce": nonce,
        "X-LINE-Authorization": signature
      },
      body: JSON.stringify(body)
    });
    const json = await response.json();

    if (json.returnCode === "0000") {
      return res.redirect(`/payment-success.html?orderId=${encodeURIComponent(orderId || "")}`);
    }
    res.redirect(`/payment-cancel.html?reason=${encodeURIComponent(json.returnMessage || "unknown")}`);
  } catch (err) {
    console.error("payment confirm error:", err);
    res.status(500).send("Confirm error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
