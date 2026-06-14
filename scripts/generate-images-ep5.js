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

// EP5 = Act 5 (ch 15 finale): อีกฝั่งกำแพง
const PROMPTS = [
  // Opener (3)
  { id: "01_open_2041",          prompt: "Wide cinematic establishing shot of a futuristic Chinese semiconductor mega-factory in 2041, glass and steel reflecting golden hour light, sense of arrival and maturity" },
  { id: "02_open_machine_first", prompt: "Wide low-angle shot of a new modern EUV-style lithography machine fully assembled in a clean room, blue accent lights glowing, scale of achievement visible" },
  { id: "03_open_wenli_44",      prompt: "Three-quarter portrait of an Asian woman around 44 years old in a tailored business jacket standing at her office window overlooking the factory floor, accumulated wisdom in her expression" },

  // Part 1 — interview + tour (15)
  { id: "04_part1_office_modern",prompt: "Modern executive office with floor-to-ceiling glass overlooking semiconductor production lines below, warm wood interior, single soft desk lamp, contemplative" },
  { id: "05_part1_journalist",   prompt: "Asian male journalist in his thirties holding a tablet and audio recorder sitting opposite Wenli in her office, professional but warm interview setting" },
  { id: "06_part1_chip_first",   prompt: "Macro close-up of the first finished semiconductor chip produced by the new Chinese EUV machine, intricate circuitry visible, dramatic spotlight, technological sublime" },
  { id: "07_part1_production",   prompt: "Wide aerial view of a massive new semiconductor production line three times larger than the previous one, hundreds of clean room workers, sense of industrial scale" },
  { id: "08_part1_old_uncle",    prompt: "The old worn white lithography machine 'uncle' now displayed in a museum-like corner of the factory, slight reverence preserved, soft display lighting" },
  { id: "09_part1_window_pause", prompt: "Asian woman in her forties pausing at her office window, looking out contemplatively at the factory below, single light from behind, contemplative weight" },
  { id: "10_part1_history_book", prompt: "Top-down still life of an open history book showing diagrams of semiconductor evolution across decades, faded edges, contemplative still life" },
  { id: "11_part1_wenli_speaks", prompt: "Tight close-up of an Asian woman speaking thoughtfully, mid-sentence, single window light catching her eyes, captured moment of profound reflection" },
  { id: "12_part1_lin_aged_lab", prompt: "An older Asian male physicist in his late fifties teaching a small group of young engineers in a modern lab, still wiry and energetic, white hair, warm laboratory light" },
  { id: "13_part1_li_meng_lead", prompt: "Young Asian woman now in her thirties leading a team meeting with confident authority, modern conference room, professional polish" },
  { id: "14_part1_jun_jun_uni",  prompt: "Young Asian man around twenty years old in a university engineering lab, working on circuits with intense focus, jacket with university crest, warm window light" },
  { id: "15_part1_corridor_walk",prompt: "Asian woman in her forties walking down a modern semiconductor facility corridor alone, soft fluorescent lighting from above, contemplative pace" },
  { id: "16_part1_wenli_smile",  prompt: "Close-up of an Asian woman with a private knowing smile, looking down at something in her hands off-frame, captured in moment of memory" },
  { id: "17_part1_team_now",     prompt: "Group photograph of the current research team — hundreds of engineers including Wenli and Lin standing for a portrait in the factory atrium, accomplishment captured" },
  { id: "18_part1_recorder_off", prompt: "Close-up of the journalist's audio recorder being clicked off, end of interview moment, soft warm light, beat of intimacy after professional facade" },

  // Part 2 — Eva's book + the letter exchange (15)
  { id: "19_part2_eva_retired",  prompt: "European woman in her late forties with silver streaks in blonde hair, working at a writing desk in a Dutch home, autumn light through window, peaceful retired life" },
  { id: "20_part2_book_writing", prompt: "Top-down close-up of an older European woman's hands writing a memoir at a wooden desk, fountain pen, scattered notes about EUV history" },
  { id: "21_part2_eva_book_cover",prompt: "Close-up still life of a hardcover book with a clean minimalist cover design about EUV history, single library lamp casting amber light, weight of achievement" },
  { id: "22_part2_postal_package",prompt: "Hands wrapping a book in brown paper for international shipping, careful gesture of an old correspondence, single warm light" },
  { id: "23_part2_package_arrive",prompt: "Asian woman opening a brown paper package at her home desk, revealing a hardcover book inside, gentle anticipation captured" },
  { id: "24_part2_book_in_hands",prompt: "Close-up of two female hands holding a hardcover book, fingers slowly opening to the inside cover, soft warm reading light" },
  { id: "25_part2_handwriting",  prompt: "Macro close-up of handwritten dedication in a book's flyleaf in elegant European cursive, just visible as English letters, soft warm lamp light" },
  { id: "26_part2_wenli_reading",prompt: "Tight close-up of an Asian woman's eyes reading the inscription, single tear forming, profound emotion contained, warm window light" },
  { id: "27_part2_wenli_book_send",prompt: "Asian woman carefully wrapping her own book to send back across the world, same brown paper, mirror gesture to Eva's, intimate continuity" },
  { id: "28_part2_writing_dedicate",prompt: "Close-up of an Asian woman writing a dedication in Thai characters on the inside cover of her own book, fountain pen, single warm desk lamp" },
  { id: "29_part2_package_send", prompt: "Asian woman at a post office counter sending a package internationally, calm dignified gesture, beam of window light" },
  { id: "30_part2_two_books",    prompt: "Conceptual still life of two books — Eva's English book and Wenli's Chinese book — facing each other on a shared desk, dramatic spotlight, symbolic balance" },
  { id: "31_part2_machine_window",prompt: "Asian woman looking through the observation window into a clean room where a EUV machine is running, blue light from inside reflecting on her face" },
  { id: "32_part2_light_glow",   prompt: "Conceptual visualization of pure pale blue EUV light source glowing through observation glass, dust visible in the beam, scientific sublime" },
  { id: "33_part2_window_close", prompt: "Tight close-up of EUV light reflected in Wenli's eye as she watches through observation glass, beauty of the moment captured" },

  // Part 3 — Reflection + ending (10)
  { id: "34_part3_uncle_old",    prompt: "Wide shot of the old 'uncle' machine in its display corner — historic reverence preserved, blue LED still glowing faintly even though retired, single beam of soft display light" },
  { id: "35_part3_wang_photo",   prompt: "Close-up of a framed photograph on a desk showing the late Wang Jianguo in his prime, surrounded by recent achievements, sense of presence after passing" },
  { id: "36_part3_lin_chalkboard",prompt: "Older physicist standing alone before a chalkboard full of new equations being taught to invisible students, devotion of pure science continuing" },
  { id: "37_part3_eva_alone",    prompt: "European woman in her late forties sitting alone in her Dutch home reading something, single window light, contemplative satisfaction" },
  { id: "38_part3_son_grown",    prompt: "Young Asian man around twenty years old in a university lab using modern Chinese-made semiconductors in his project, casual confident future generation" },
  { id: "39_part3_handshake_future",prompt: "Conceptual image of two young hands of different ethnicities almost touching, symbolic of the next generation's possible meeting, soft hopeful light" },
  { id: "40_part3_desk_return",  prompt: "Asian woman sitting back down at her desk after a long contemplation, hands placed on keyboard ready to continue work, single warm lamp" },
  { id: "41_part3_screen_open",  prompt: "Close-up of a computer screen opening up to work documents, calm ready posture of returning to labor, blue screen light" },
  { id: "42_part3_keyboard_calm",prompt: "Top-down close-up of female hands typing calmly and steadily on a keyboard, dedication of continuing to build, soft window light" },
  { id: "43_part3_factory_dawn", prompt: "Wide cinematic shot of the semiconductor factory complex at dawn, beautiful golden light over glass and steel, sense of hope and continuity" },

  // Series finale (2)
  { id: "44_finale_cathedral",   prompt: "Conceptual cinematic image of a massive cathedral viewed from below, half-built scaffolding still around upper sections, golden light streaming through, generational labor visualized" },
  { id: "45_finale_endcard",     prompt: "Wide moody establishing shot of EUV light beam piercing through atmospheric haze in a clean room, generations of work visible in equipment arrayed around, space for end title overlay" }
];

const OUTPUT_DIR = path.join(__dirname, "..", "assets", "images-ep5");
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
  console.log(`Generating ${PROMPTS.length} EP5 images\n`);
  const args = process.argv.slice(2);
  const slice = PROMPTS.slice(args[0]?parseInt(args[0])-1:0, args[1]?parseInt(args[1]):PROMPTS.length);
  for (const it of slice) {
    process.stdout.write(`  ${it.id}... `);
    try { await generate(it); console.log("✓"); } catch (e) { console.log(`✗ ${e.message}`); }
  }
})();
