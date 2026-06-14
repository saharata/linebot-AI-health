require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error("Missing FAL_KEY"); process.exit(1); }

const MODEL = process.env.FAL_MODEL || "fal-ai/flux/dev";
const IMAGE_SIZE = "landscape_16_9";
const STYLE_SUFFIX =
  "Cinematic photograph, Denis Villeneuve aesthetic, cool blue color grade " +
  "with warm amber accents, volumetric light, atmospheric haze, shallow depth " +
  "of field, photorealistic, 35mm film grain, no text, no watermark";

// 45 prompts for EP2 = Act 2 (ch 4-8)
const PROMPTS = [
  // === Opener (3) ===
  { id: "01_open_winter_factory",  prompt: "Wide cinematic shot of a massive semiconductor factory complex in northern China during heavy winter, snow falling, fog and steam from chimneys, dim warm lights from windows, predawn blue-grey sky" },
  { id: "02_open_redfolder",       prompt: "Top-down still life of a closed red folder on a dark mahogany meeting room desk, single brass lamp light, the room around it in shadow, mysterious and weighty" },
  { id: "03_open_lightbeam_blue",  prompt: "A single beam of pale blue-white EUV-like light cutting diagonally through deep black space, glowing dust particles drifting through it, minimalist conceptual" },

  // === Ch 4 — สิ่งที่อยู่ในกล่อง (8) ===
  { id: "04_ch4_shanghai_port",    prompt: "Wide industrial shot of Shanghai container port at dawn, cranes silhouetted against mist, stacked colorful containers, a large cargo ship being unloaded, cinematic scale" },
  { id: "05_ch4_wooden_crate",     prompt: "Close-up of a large wooden shipping crate stamped 'Research Equipment - Laboratory Use', dramatic side light revealing wood grain, weathered metal corners, mysterious contents implied" },
  { id: "06_ch4_warehouse",        prompt: "Interior of an industrial receiving warehouse with high ceilings, a single wooden crate in center-frame, two figures in distance looking at it, cold blue overhead lights, dust particles in the air" },
  { id: "07_ch4_wenli_wang_crate", prompt: "Medium two-shot of an older Chinese man in white lab coat and a young Asian woman in dark coat standing before a tall wooden shipping crate, contemplative serious expressions, side light" },
  { id: "08_ch4_wang_hand_wood",   prompt: "Close-up of an older man's weathered hand resting on rough wooden planks of a shipping crate, single warm side light, texture of grain visible, gesture of weight and decision" },
  { id: "09_ch4_singapore_office", prompt: "Modern Singapore corporate office at dusk, glass facade reflecting harbor lights, single figure visible inside, clinical anonymous business atmosphere, slight tension" },
  { id: "10_ch4_macau_alley",      prompt: "Narrow Macau side street at night, neon signs reflected on wet pavement, two anonymous figures briefly visible passing through, secretive atmosphere, cinematic noir" },
  { id: "11_ch4_paperwork",        prompt: "Top-down close-up of stacked shipping documents and customs declarations, official red stamps, partially visible signatures, single desk lamp light, papers slightly crumpled at edges" },

  // === Ch 5 — จดหมายที่ไม่ถูกส่ง (7) ===
  { id: "12_ch5_morning_window",   prompt: "Asian woman sitting at a wooden desk in a small apartment near a frosted window, snow falling outside, warm desk lamp casting amber light, contemplative serious expression, cold winter morning" },
  { id: "13_ch5_email_screen",     prompt: "Close-up of a laptop screen at night showing an unread email from 'Eva de Vries', subject line visible, single bright screen reflection illuminating darkness around" },
  { id: "14_ch5_wenli_reading",    prompt: "Tight close-up of an Asian woman's face illuminated only by laptop screen blue glow, reading intensely, eyes glassy with held emotion, dark room background" },
  { id: "15_ch5_typing_hands",     prompt: "Top-down close-up of female hands typing on a laptop keyboard at night, fast intent fingers, subtle shake hinting at emotional writing, warm desk light" },
  { id: "16_ch5_send_hover",       prompt: "Extreme close-up of a single finger hovering above the Enter key on a laptop keyboard, screen glow reflecting on the fingertip, suspended decision moment" },
  { id: "17_ch5_delete_screen",    prompt: "Close-up of a laptop screen showing a long draft email being selected and deleted, words highlighted in blue, single click of inevitability" },
  { id: "18_ch5_folder_save",      prompt: "Computer screen close-up showing a folder being created and named in Thai characters, the rest of desktop in soft focus, melancholic blue color grade" },

  // === Ch 6 — โครงการที่ไม่มีชื่อ (6) ===
  { id: "19_ch6_meeting_room",     prompt: "Empty windowless conference room with a long dark wood table, seven chairs positioned around it, single fluorescent overhead light, sterile classified atmosphere, no decorations" },
  { id: "20_ch6_locked_phones",    prompt: "Top-down close-up of a wooden box containing seven smartphones, neatly arranged, single dim overhead light, a sense of secrecy and surrender" },
  { id: "21_ch6_seven_seated",     prompt: "Wide low-angle shot of seven Asian engineers seated around a long meeting table from behind, only backs of heads visible, single dramatic ceiling light, conspiracy meeting atmosphere" },
  { id: "22_ch6_redfolder_open",   prompt: "Top-down close-up of a red folder being opened to reveal a single page with one Chinese character '光' (light) printed in bold black, dramatic spotlight, weight of secret revealed" },
  { id: "23_ch6_zhang_director",   prompt: "Three-quarter portrait of a stern Chinese man in his late fifties wearing dark suit, sitting at the head of a meeting table, single overhead light, authoritative quiet presence" },
  { id: "24_ch6_handshake_silent", prompt: "Close-up of two pairs of hands shaking firmly across a dark conference table, dim warm light, sense of pact being made in silence, classical composition" },

  // === Ch 7 — ดร.หลิน (8) ===
  { id: "25_ch7_lin_portrait",     prompt: "Portrait of a Chinese physicist in his early forties, small wiry build, smiling slightly with mischief, white lab coat over button-down shirt, holding a piece of chalk, cinematic warm side light" },
  { id: "26_ch7_chalkboard_eqs",   prompt: "Close-up of a black chalkboard densely covered with handwritten physics equations and diagrams about EUV light generation, fingerprints and chalk dust on the surface, soft side light" },
  { id: "27_ch7_lin_napkin",       prompt: "Close-up of a man's hand writing complex equations on a paper napkin at a cafe table, coffee cup nearby, casual urgent intellectual energy" },
  { id: "28_ch7_lin_palm",         prompt: "Macro close-up of an older man's open palm covered with handwritten physics equations in pen, intricate detail, soft warm light, conveys obsession and devotion to science" },
  { id: "29_ch7_lab_tin_drop",     prompt: "Abstract scientific visualization: a glowing molten tin droplet suspended in vacuum with a high-powered laser beam aimed at it, dramatic lighting, sci-fi industrial laboratory aesthetic" },
  { id: "30_ch7_lin_wenli_talk",   prompt: "Medium shot of a wiry Asian man gesturing animatedly while a young Asian woman listens intently, both standing before a chalkboard full of equations, warm laboratory light, mentor and student dynamic" },
  { id: "31_ch7_vacuum_chamber",   prompt: "Wide industrial laboratory shot of a large stainless steel vacuum chamber with thick observation windows, blue cooling tubes wrapped around its surface, scientific equipment, cool blue laboratory lighting" },
  { id: "32_ch7_lin_alone",        prompt: "Wide shot of a wiry Asian physicist standing alone before a wall-sized chalkboard at night, writing equations under single overhead light, devotion and solitude of pure research" },

  // === Ch 8 — หกเปอร์เซ็นต์ (9) ===
  { id: "33_ch8_3am_lab",          prompt: "Wide shot of a dimly lit laboratory at 3 AM, multiple computer monitors glowing with data, several engineers in white coats watching screens intently, atmospheric haze, tense quiet anticipation" },
  { id: "34_ch8_stacked_chips",    prompt: "Macro close-up of a high bandwidth memory chip stack, multiple thin silicon layers visible with copper interconnects, dramatic side lighting, technical sublime beauty" },
  { id: "35_ch8_yield_screen",     prompt: "Close-up of a large laboratory monitor screen displaying the single number '6%' in bold red on dark background, dramatic moment, all other data faded in periphery" },
  { id: "36_ch8_wang_tears",       prompt: "Tight close-up of an older Chinese man's face, weathered fifty years old, single tear running down his cheek, eyes red, expression of overwhelming emotion long held back, dim lab lighting" },
  { id: "37_ch8_silent_team",      prompt: "Group shot of seven engineers in white lab coats standing silent and still around a monitor, none speaking, captured in moment of collective realization, soft overhead light" },
  { id: "38_ch8_wenli_witness",    prompt: "Close-up of an Asian woman in her early thirties watching something off-frame with tears in her eyes, captured in the moment of witnessing history, soft blue laboratory light" },
  { id: "39_ch8_beijing_news",     prompt: "Close-up of a large newspaper or news website headline in Chinese reporting a domestic semiconductor breakthrough, soft focus on official typography, sense of national announcement" },
  { id: "40_ch8_kim_office_seoul", prompt: "Older Korean man in his sixties sitting at a desk in a high Seoul office at night, looking at a phone screen with subtle smile, city skyline visible through window behind, contemplative" },
  { id: "41_ch8_message_phone",    prompt: "Close-up of a smartphone screen showing a single message in mixed languages, dark room around the glowing phone, intimate cross-border communication moment" },

  // === Outro (4) ===
  { id: "42_outro_dawn_factory",   prompt: "Wide shot of a Chinese semiconductor factory at dawn after the long night, faint warm light beginning at horizon, fog lifting, sense of new beginning after long struggle" },
  { id: "43_outro_uncle_aging",    prompt: "Close-up of the worn white lithography machine known as 'uncle', new scratches and faded labels visible, blue base LED still glowing, sense of aging and dedication" },
  { id: "44_outro_son_question",   prompt: "Asian boy around twelve years old looking up at his mother off-frame asking a question, kitchen setting with warm evening light, innocent worried expression" },
  { id: "45_outro_endcard",        prompt: "Wide moody establishing shot of a clean room with a single massive machine in distance through atmospheric haze, blue accents, space at top for title text overlay" }
];

const OUTPUT_DIR = path.join(__dirname, "..", "assets", "images-ep2");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generate(item) {
  const url = `https://fal.run/${MODEL}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `${item.prompt}. ${STYLE_SUFFIX}`,
      image_size: IMAGE_SIZE,
      num_images: 1,
      enable_safety_checker: true
    })
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const imgUrl = json.images?.[0]?.url || json.image?.url;
  if (!imgUrl) throw new Error("No image URL");
  const imgRes = await fetch(imgUrl);
  const buffer = await imgRes.buffer();
  const ext = imgUrl.match(/\.(jpe?g|png|webp)/i)?.[1] || "jpg";
  const outPath = path.join(OUTPUT_DIR, `${item.id}.${ext}`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

(async () => {
  console.log(`Generating ${PROMPTS.length} EP2 images via ${MODEL}\n`);
  const args = process.argv.slice(2);
  const startIdx = args[0] ? parseInt(args[0], 10) - 1 : 0;
  const endIdx = args[1] ? parseInt(args[1], 10) : PROMPTS.length;
  const slice = PROMPTS.slice(startIdx, endIdx);
  console.log(`Rendering items ${startIdx + 1}–${endIdx}\n`);

  let okCount = 0, failCount = 0;
  for (const item of slice) {
    process.stdout.write(`  ${item.id}... `);
    try {
      const outPath = await generate(item);
      const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(0);
      console.log(`✓ ${sizeKB} KB`);
      okCount++;
    } catch (err) { console.log(`✗ ${err.message}`); failCount++; }
  }
  console.log(`\nDone — ${okCount} ok, ${failCount} failed.`);
})();
