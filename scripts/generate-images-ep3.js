require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error("Missing FAL_KEY"); process.exit(1); }
const MODEL = process.env.FAL_MODEL || "fal-ai/flux/dev";
const IMAGE_SIZE = "landscape_16_9";
const STYLE_SUFFIX =
  "Cinematic photograph, Denis Villeneuve aesthetic, cool blue color grade with warm amber accents, " +
  "volumetric light, atmospheric haze, shallow depth of field, photorealistic, 35mm film grain, no text, no watermark";

// EP3 = Act 3 (ch 9-11): กำแพงที่ทำด้วยแสง
const PROMPTS = [
  // Opener (3)
  { id: "01_open_2033",          prompt: "Wide aerial cinematic shot of a Chinese mega-city at twilight in the year 2033, neon signs in Chinese characters, mist over rooftops, futuristic but melancholic" },
  { id: "02_open_wall_concept",  prompt: "Conceptual image of a translucent wall of pale blue light dividing a foggy landscape in two halves, surreal cinematic, atmospheric haze" },
  { id: "03_open_uncle_alone",   prompt: "Worn white industrial lithography machine alone in a dim clean room, sense of aging and abandonment, single blue LED still glowing, dust visible in beam of light" },

  // Ch 9 — ราคาที่บ้าน (12)
  { id: "04_ch9_apartment_eve",  prompt: "Modest middle-class Chinese apartment dining room at evening, soft warm lamp light, rice cooker steaming, simple meal on table, intimate domestic atmosphere" },
  { id: "05_ch9_son_backpack",   prompt: "Asian boy about twelve years old in school uniform putting down a heavy backpack near the apartment door, after-school tired expression, warm light" },
  { id: "06_ch9_mom_chopsticks", prompt: "Close-up of an Asian woman's hand putting down chopsticks at a dinner table, hesitation captured in the gesture, soft amber light" },
  { id: "07_ch9_son_question",   prompt: "Medium close-up of an Asian boy looking up at his mother with a sincere puzzled question, eyes innocent and probing, warm domestic light" },
  { id: "08_ch9_mom_silent",     prompt: "Close-up of an Asian mother's face caught in a long silent moment, eyes searching for words, soft natural light from a kitchen window" },
  { id: "09_ch9_phone_iphone",   prompt: "Top-down still life of a smartphone on a table next to a grandmother's wrinkled hands, slight tension between old and new technology" },
  { id: "10_ch9_chip_bridge",    prompt: "Abstract conceptual image of microchips on a circuit board with a glowing bridge of light arcing between two halves, technological metaphor" },
  { id: "11_ch9_hug_tears",      prompt: "Asian woman embracing her son tightly, head turned away to hide tears, warm tender domestic light, intimate emotional beat" },
  { id: "12_ch9_night_window",   prompt: "Asian woman sitting alone at a high-rise apartment window late at night, city lights spread below, she stares at nothing, melancholic blue tone" },
  { id: "13_ch9_eva_memory",     prompt: "Half-faded memory image of a Singapore restaurant with two women at a window table, blurry as if recollected, dreamlike soft focus" },
  { id: "14_ch9_two_worlds",     prompt: "Diptych composition: left side an Asian boy sleeping peacefully in his room, right side a European girl of the same age sleeping in a Dutch bedroom, both bathed in blue night light, parallel lives" },
  { id: "15_ch9_mom_resolve",    prompt: "Tight close-up of an Asian woman's eyes at dawn after a sleepless night, soft determination forming, single warm light hitting one side of her face" },

  // Ch 10 — กำแพงสูงขึ้น (10)
  { id: "16_ch10_news_breaking", prompt: "Close-up of a TV screen showing a breaking news banner in Chinese characters about US tech sanctions, soft blue glow lighting a dark room" },
  { id: "17_ch10_meeting_grim",  prompt: "Wide shot of a corporate meeting room with seven Asian executives looking at a presentation screen, somber atmosphere, cool overhead lighting" },
  { id: "18_ch10_zhang_calm",    prompt: "Three-quarter portrait of a stern Asian executive in his late fifties reading a report calmly, single dramatic desk lamp, weight of decision visible" },
  { id: "19_ch10_uncle_dying",   prompt: "Close-up of the worn white lithography machine with a single warning light blinking red, sense of slowly dying technology, low blue ambient light" },
  { id: "20_ch10_engineer_disas",prompt: "Engineers in white coats disassembling a complex precision machine, parts spread on a clean workbench, intent careful work, bright laboratory light" },
  { id: "21_ch10_parts_table",   prompt: "Top-down close-up of dozens of precision machine components arranged neatly on a clean workbench, blueprints visible, intricate engineering still life" },
  { id: "22_ch10_3am_workshop",  prompt: "Wide shot of a workshop at 3 AM with two engineers studying a disassembled component under a single bright lamp, dedication and exhaustion" },
  { id: "23_ch10_wenli_uncle",   prompt: "Asian woman in clean-room suit standing alone before the worn white machine in a dim clean room, hand resting on its surface, intimate moment of promise" },
  { id: "24_ch10_uncle_glow",    prompt: "Close-up of the blue LED base lights of the old industrial machine, still glowing softly in the dim room, last warmth of a machine kept alive" },
  { id: "25_ch10_red_folder_2",  prompt: "Hand placing the red 'light' project folder onto a clean office desk, sense of urgency to accelerate, dramatic side light" },

  // Ch 11 — รอยร้าวที่โซล (12)
  { id: "26_ch11_seoul_night",   prompt: "Wide cinematic shot of Seoul skyline at night, glowing apartment blocks and downtown highrises, contemplative atmosphere" },
  { id: "27_ch11_kim_office",    prompt: "Korean man in his sixties in a corporate office at night, looking out a high window at Seoul cityscape, contemplative back-three-quarter view" },
  { id: "28_ch11_kim_phone",     prompt: "Close-up of an older Korean man's hands typing a long message on a smartphone, screen glow on his face, careful intentional gesture" },
  { id: "29_ch11_korea_factory", prompt: "Wide shot of a massive Korean semiconductor factory at twilight, scale and industrial sublime, atmospheric haze" },
  { id: "30_ch11_charts_korea",  prompt: "Korean stock chart visualization showing volatility, screen reflections on engineer's face in dark conference room, tense atmospheric" },
  { id: "31_ch11_korea_engineer",prompt: "Group of Korean engineers in white lab coats walking down a corridor, conversation hushed, fluorescent overhead light, professional tension" },
  { id: "32_ch11_message_arrive",prompt: "Close-up of a phone screen at night showing a long incoming message, single bright screen glow in a dark Chinese office" },
  { id: "33_ch11_wang_reading",  prompt: "Older Chinese man in white lab coat reading a message on his phone at night, expression of recognition and sadness, single desk lamp" },
  { id: "34_ch11_wenli_read",    prompt: "Asian woman reading a printed message at a desk under warm lamp light, captured in a moment of profound realization, blue night through window" },
  { id: "35_ch11_two_engineers", prompt: "Diptych concept: split screen showing a Chinese engineer in clean room on one side and a Korean engineer in their lab on other side, mirror compositions, parallel lives" },
  { id: "36_ch11_wall_concept2", prompt: "Two figures silhouetted on opposite sides of a glowing translucent wall of pale blue light, neither can cross, surreal conceptual atmosphere" },
  { id: "37_ch11_solidarity",    prompt: "Two pairs of hands almost touching through frosted glass, soft warm light, sense of connection blocked by transparent barrier, intimate metaphor" },

  // Outro (8)
  { id: "38_outro_dawn_seoul",   prompt: "Seoul skyline at dawn, fog lifting, warm light beginning at horizon, contemplative hopeful tone" },
  { id: "39_outro_wang_aging",   prompt: "Older Chinese man in lab coat walking slowly down a clean room corridor, slight stoop, dedicated long career, soft fluorescent light" },
  { id: "40_outro_team_grown",   prompt: "Wide shot of a large semiconductor laboratory now with dozens of engineers working, growth from original team of seven, busy bright atmosphere" },
  { id: "41_outro_uncle_kept",   prompt: "The worn white industrial machine kept in a place of honor in a museum-like corner of a factory, slight reverence, soft display lighting" },
  { id: "42_outro_son_grown",    prompt: "Asian teenager around fifteen years old studying late at night with textbooks open, focused determined expression, warm desk lamp light" },
  { id: "43_outro_eva_office",   prompt: "European woman in her forties working alone at an Aurolith corporate office at night, blonde hair, computer screens glowing, contemplative" },
  { id: "44_outro_wall_lower",   prompt: "Surreal conceptual shot of the glowing wall of light now slightly shorter than before, sense of slow erosion over time, hopeful undertone" },
  { id: "45_outro_endcard",      prompt: "Wide moody clean room shot with multiple machines visible in atmospheric haze, blue accent lights, space at top for title text" }
];

const OUTPUT_DIR = path.join(__dirname, "..", "assets", "images-ep3");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generate(item) {
  const res = await fetch(`https://fal.run/${MODEL}`, {
    method: "POST",
    headers: { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `${item.prompt}. ${STYLE_SUFFIX}`,
      image_size: IMAGE_SIZE, num_images: 1, enable_safety_checker: true
    })
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0,200)}`);
  const json = await res.json();
  const imgUrl = json.images?.[0]?.url || json.image?.url;
  const buffer = await (await fetch(imgUrl)).buffer();
  const ext = imgUrl.match(/\.(jpe?g|png|webp)/i)?.[1] || "jpg";
  fs.writeFileSync(path.join(OUTPUT_DIR, `${item.id}.${ext}`), buffer);
}

(async () => {
  console.log(`Generating ${PROMPTS.length} EP3 images\n`);
  const args = process.argv.slice(2);
  const slice = PROMPTS.slice(args[0]?parseInt(args[0])-1:0, args[1]?parseInt(args[1]):PROMPTS.length);
  for (const it of slice) {
    process.stdout.write(`  ${it.id}... `);
    try { await generate(it); console.log("✓"); } catch (e) { console.log(`✗ ${e.message}`); }
  }
})();
