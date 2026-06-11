require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY in .env");
  process.exit(1);
}

const VOICE_ALICE = "Xb7hH8MSUJpSbSDYk0k2";
const VOICE_LIAM = "TX3LPaxmHKxFdv7VOQHJ";
const MODEL = "eleven_v3";

const SHOTS = [
  {
    id: "vo_01",
    voice: VOICE_ALICE,
    text: "กลิ่นของห้องคลีนรูม... ฉันจำได้ก่อนจำหน้าใครในทีม",
    settings: { stability: 0.55, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true }
  },
  {
    id: "vo_02",
    voice: VOICE_ALICE,
    text: "มันคือกลิ่นที่ไม่มีกลิ่น... สะอาดกว่าห้องผ่าตัด",
    settings: { stability: 0.65, similarity_boost: 0.80, style: 0.25, use_speaker_boost: true }
  },
  {
    id: "vo_03",
    voice: VOICE_ALICE,
    text: "ฝุ่นหนึ่งอนุภาค ต่อหนึ่งลูกบาศก์ฟุต... คือศัตรู",
    settings: { stability: 0.50, similarity_boost: 0.75, style: 0.45, use_speaker_boost: true }
  },
  {
    id: "vo_04",
    voice: VOICE_LIAM,
    text: "นี่คือ... ลุง.\n\nเพราะมันแก่... และเพราะเราพึ่งมันเหมือนพึ่งญาติผู้ใหญ่ ที่ยังไม่ตาย",
    settings: { stability: 0.60, similarity_boost: 0.80, style: 0.40, use_speaker_boost: true }
  },
  {
    id: "vo_05",
    voice: VOICE_LIAM,
    text: "เฉินเหวินลี่... จำไว้อย่างหนึ่ง.\n\nเราไม่ต้องเป็นที่หนึ่ง... เราแค่ต้องเป็นสิ่งที่เขาแซงชั่นไม่ได้",
    settings: { stability: 0.70, similarity_boost: 0.85, style: 0.50, use_speaker_boost: true }
  }
];

const OUTPUT_DIR = path.join(__dirname, "..", "voiceover");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generate(shot) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${shot.voice}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg"
    },
    body: JSON.stringify({
      text: shot.text,
      model_id: MODEL,
      voice_settings: shot.settings
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status} ${err}`);
  }
  const buffer = await res.buffer();
  const outPath = path.join(OUTPUT_DIR, `${shot.id}.mp3`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

(async () => {
  console.log(`Generating ${SHOTS.length} voiceover clips to ${OUTPUT_DIR}\n`);
  for (const shot of SHOTS) {
    process.stdout.write(`  ${shot.id} (${shot.voice === VOICE_ALICE ? "Alice" : "Liam"})... `);
    try {
      const outPath = await generate(shot);
      const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(0);
      console.log(`✓ ${sizeKB} KB`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
  }
  console.log(`\nDone. Files in ${OUTPUT_DIR}/`);
  console.log("Drag into CapCut timeline in order: vo_01 → vo_05");
})();
