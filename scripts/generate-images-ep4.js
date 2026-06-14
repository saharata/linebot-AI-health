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

// EP4 = Act 4 (ch 12-14): สิ่งที่ส่งต่อ
const PROMPTS = [
  // Opener (3)
  { id: "01_open_2035",         prompt: "Wide shot of modern Chinese semiconductor industrial zone in 2035, expanded factories with new construction visible, sense of established maturity, dawn lighting" },
  { id: "02_open_legacy",       prompt: "Conceptual still life of an old industrial blueprint overlaid with new high-tech CAD designs, generational handoff visualization" },
  { id: "03_open_chairs",       prompt: "Two empty office chairs facing each other across a clean desk in an empty meeting room, conceptual visual of mentorship and succession, single window light" },

  // Ch 12 — รุ่นที่เกิดหลังกำแพง (12)
  { id: "04_ch12_limeng_arrive",prompt: "Young Asian woman in her mid-twenties walking into a corporate semiconductor office on her first day, professional confident posture, modern bright lighting" },
  { id: "05_ch12_team_classroom",prompt: "Asian woman in her early forties teaching a small group of young engineers in a modern conference room, whiteboard with diagrams, attentive students" },
  { id: "06_ch12_limeng_question",prompt: "Close-up of a young Asian woman with short modern hair raising her hand to ask a question, alert intelligent expression, bright office light" },
  { id: "07_ch12_wenli_pause",  prompt: "Tight close-up of an Asian woman in her early forties caught in mid-thought, eyes contemplative, soft window light, weight of recognition crossing her face" },
  { id: "08_ch12_pyramid_chart",prompt: "Whiteboard close-up with a hand-drawn pyramid diagram of the global semiconductor supply chain, market segments labeled, engineer's hand pointing" },
  { id: "09_ch12_two_generation",prompt: "Side-by-side composition of two Asian women — one in her forties one in her twenties — engaged in conversation, generational difference in dress and energy, warm light" },
  { id: "10_ch12_factory_global",prompt: "Wide aerial view of multiple Chinese semiconductor factories operating at scale, industrial vastness, prosperity of established industry" },
  { id: "11_ch12_li_meng_work", prompt: "Young Asian female engineer focused on a complex schematic at a clean office workstation, multiple monitors, confident professional environment" },
  { id: "12_ch12_market_volume",prompt: "Close-up of a financial market display showing strong Chinese semiconductor companies on top of revenue charts, screen reflections, sense of economic strength" },
  { id: "13_ch12_wenli_evening",prompt: "Asian woman walking alone down a corporate hallway at evening after work, soft hallway light, contemplative pace" },
  { id: "14_ch12_book_journal", prompt: "Top-down close-up of a worn personal journal open to a page of handwritten Thai notes, single warm desk lamp, intimate" },
  { id: "15_ch12_reflection",   prompt: "Asian woman sitting at a kitchen table with tea, expression of finally understanding something long contemplated, soft evening light through window" },

  // Ch 13 — การจากไปของหวัง (15)
  { id: "16_ch13_hospital_window",prompt: "Hospital room view through a window at evening, soft fading light, sense of stillness and waiting, melancholic blue tone" },
  { id: "17_ch13_wang_bed",     prompt: "Older Chinese man in hospital bed, oxygen tubing visible, but expression peaceful and alert, single soft light source, dignified" },
  { id: "18_ch13_hands_held",   prompt: "Tight close-up of an older male hand being held by a younger female hand at a hospital bedside, frail and tender, warm subdued light" },
  { id: "19_ch13_cathedral_metaphor",prompt: "Conceptual image of a medieval cathedral under construction over centuries, scaffolding around half-built walls, golden light, metaphor of generational building" },
  { id: "20_ch13_brick_first",  prompt: "Close-up of a single brick being laid in a wall with mortar, weathered older hands placing it carefully, sense of patient labor" },
  { id: "21_ch13_wenli_cry",    prompt: "Close-up of an Asian woman crying at a hospital bedside, no shame in tears, single soft lamp lighting her face from above" },
  { id: "22_ch13_funeral_room", prompt: "Wide shot of a Chinese funeral hall with traditional white wreaths and mourners in dark clothing, somber respectful atmosphere, soft natural light" },
  { id: "23_ch13_white_flowers",prompt: "Close-up of a bouquet of white chrysanthemums being placed at a funeral altar, simple gesture, weight of distance traveled" },
  { id: "24_ch13_kim_stranger", prompt: "Older Korean man in business suit standing alone at the back of a funeral hall, unobtrusive but present, dignified solitude" },
  { id: "25_ch13_doorway",      prompt: "Asian woman and older Korean man speaking briefly at a funeral hall doorway, intimate conversation between strangers united by shared grief" },
  { id: "26_ch13_old_photo",    prompt: "Close-up still life of an old framed photograph showing two young engineers in 1990s Stanford lab coats, faded color, nostalgic" },
  { id: "27_ch13_kim_leaving",  prompt: "Older Korean man in suit walking away alone down a corridor at a funeral, back view, weight of decades visible in his posture" },
  { id: "28_ch13_wenli_journal",prompt: "Asian woman writing in her personal journal at home late at night, single desk lamp, single line of writing visible on the page, tears just dried" },
  { id: "29_ch13_two_continents",prompt: "Split composition: a Chinese clean room on one side, a Korean clean room on the other side, both with engineers working — same craft, separated by wall" },
  { id: "30_ch13_chrysanthemum",prompt: "Single white chrysanthemum flower in extreme close-up, water droplets on petals, soft side light, weight of meaning, still life" },

  // Ch 14 — ติดไฟ (12)
  { id: "31_ch14_lab_pre_night",prompt: "Wide shot of a large laboratory complex at night before a critical test, all the lights still on, expectant atmosphere, hundreds of engineers working" },
  { id: "32_ch14_lin_aged",     prompt: "Wiry Asian male physicist in his fifties now with white hair, still alert and intense, in a lab coat at a control station, accumulated wisdom" },
  { id: "33_ch14_team_300",     prompt: "Wide shot of three hundred engineers watching a single critical experiment, breathless silence in a vast laboratory, blue-white lighting" },
  { id: "34_ch14_laser_fire",   prompt: "Sci-fi visualization of a high-powered laser firing precisely at a falling tin droplet inside a vacuum chamber, lens flare and plasma flash" },
  { id: "35_ch14_monitor_steady",prompt: "Close-up of a laboratory monitor showing efficiency numbers holding steady instead of dropping, soft green digits, single bright screen in dim room" },
  { id: "36_ch14_lin_tears",    prompt: "Close-up of an older Asian physicist's face with tears flowing freely down his cheeks, no shame, profound moment captured" },
  { id: "37_ch14_silent_breath",prompt: "Group close-up of engineers' faces all holding their breath, frozen in moment of disbelief, single dramatic light from below the screen" },
  { id: "38_ch14_minute_clock", prompt: "Macro close-up of a digital clock counting minutes during the test, each digit transition heavy with meaning, blue display" },
  { id: "39_ch14_wenli_grab",   prompt: "Asian woman gripping the edge of a control desk to steady herself, knees weak with emotion, ambient blue light, captured in moment of overwhelming joy" },
  { id: "40_ch14_light_visible",prompt: "Conceptual visualization of the EUV light emerging — pale blue-white narrow beam glowing inside complex industrial machinery, scientific sublime" },
  { id: "41_ch14_wenli_ceiling",prompt: "Close-up of an Asian woman looking up at the ceiling of a clean room as if speaking to someone above, tears in eyes, soft fluorescent light" },
  { id: "42_ch14_steady_glow",  prompt: "Wide cinematic shot of the EUV light source still glowing steadily through observation windows, technicians visible in background watching, awe and beauty" },

  // Outro (3)
  { id: "43_outro_wang_memory", prompt: "Faded sepia memory image of an older Chinese man in lab coat walking down a clean room corridor, slightly translucent, evocative of presence after passing" },
  { id: "44_outro_red_folder_3",prompt: "The red 'light' project folder on a desk now slightly worn at the edges, having traveled years, single warm desk light, weight of journey" },
  { id: "45_outro_endcard",     prompt: "Wide moody establishing shot of a modern Chinese semiconductor research center at twilight, glass facade reflecting purple sky, space at top for title text" }
];

const OUTPUT_DIR = path.join(__dirname, "..", "assets", "images-ep4");
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
  console.log(`Generating ${PROMPTS.length} EP4 images\n`);
  const args = process.argv.slice(2);
  const slice = PROMPTS.slice(args[0]?parseInt(args[0])-1:0, args[1]?parseInt(args[1]):PROMPTS.length);
  for (const it of slice) {
    process.stdout.write(`  ${it.id}... `);
    try { await generate(it); console.log("✓"); } catch (e) { console.log(`✗ ${e.message}`); }
  }
})();
