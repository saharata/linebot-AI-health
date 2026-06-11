require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) { console.error("Missing ELEVENLABS_API_KEY"); process.exit(1); }

const TEST_TEXT_F = "ฉันจำกลิ่นของห้องคลีนรูม ได้ก่อนจำหน้าใครในทีม";
const TEST_TEXT_M = "เราไม่ต้องเป็นที่หนึ่ง เราแค่ต้องเป็นสิ่งที่เขาแซงชั่นไม่ได้";

const VOICES = [
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica",  gender: "F", text: TEST_TEXT_F },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah",    gender: "F", text: TEST_TEXT_F },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda",  gender: "F", text: TEST_TEXT_F },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice",    gender: "F", text: TEST_TEXT_F },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie",  gender: "M", text: TEST_TEXT_M },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George",   gender: "M", text: TEST_TEXT_M },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian",    gender: "M", text: TEST_TEXT_M },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam",     gender: "M", text: TEST_TEXT_M }
];

const OUT = path.join(__dirname, "..", "voiceover-test");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

async function gen(v) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${v.id}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text: v.text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true }
    })
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const buffer = await res.buffer();
  const out = path.join(OUT, `test_${v.gender}_${v.name}.mp3`);
  fs.writeFileSync(out, buffer);
  return out;
}

(async () => {
  console.log(`Testing ${VOICES.length} voices in Thai...\n`);
  for (const v of VOICES) {
    process.stdout.write(`  ${v.gender} ${v.name.padEnd(10)} (${v.id})... `);
    try {
      await gen(v);
      console.log("✓");
    } catch (e) { console.log("✗", e.message); }
  }
  console.log(`\nDone. Listen and pick the most Thai-native sounding one.`);
})();
