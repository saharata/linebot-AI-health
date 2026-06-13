require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error("Missing FAL_KEY in .env  (get one at https://fal.ai/dashboard/keys)");
  process.exit(1);
}

const MODEL = process.env.FAL_MODEL || "fal-ai/flux/dev";
const IMAGE_SIZE = "landscape_16_9";  // 1024x576 — matches YouTube
const STYLE_SUFFIX =
  "Cinematic photograph, Denis Villeneuve aesthetic, cool blue color grade " +
  "with warm amber accents, volumetric light, atmospheric haze, shallow depth " +
  "of field, photorealistic, 35mm film grain, no text, no watermark";

// 45 prompts organized by audiobook section
const PROMPTS = [
  // === Opener (3) ===
  { id: "01_open_factory_dawn",  prompt: "Wide low-angle establishing shot of a massive white semiconductor fabrication building at dawn, fog drifting at the base, single warm yellow light glowing from one corner window, sky transitioning from deep navy to pale pink" },
  { id: "02_open_lightbeam",     prompt: "Pure black background with a single beam of pale blue-white light cutting diagonally through darkness, glowing dust particles drifting, minimalist composition with room for text" },
  { id: "03_open_hefei_aerial",  prompt: "Aerial drone view of Hefei industrial district before sunrise, scattered building lights, mist over rooftops, wide industrial landscape" },

  // === Chapter 1 — ลุง (12) ===
  { id: "04_ch1_locker_room",    prompt: "Young Asian woman late twenties in yellow clean-room bunny suit, holding helmet under arm, standing at threshold of locker room, soft fluorescent overhead light, contemplative expression" },
  { id: "05_ch1_zipper_hand",    prompt: "Extreme close-up of young Asian female hands zipping up a yellow clean-room bunny suit, slight finger tremble, sterile clinical light" },
  { id: "06_ch1_badge",          prompt: "Close-up of an ID badge clipped on yellow fabric showing only the number 0427 in clean sans-serif, shallow depth of field" },
  { id: "07_ch1_corridor_pov",   prompt: "First person POV walking down a long futuristic semiconductor clean room corridor, massive white machines on both sides humming, cool blue-white ceiling lighting, polished reflective floor, vanishing point in distance" },
  { id: "08_ch1_wang_portrait",  prompt: "Older Chinese man in his fifties wearing white lab coat, grey hair half-headed, thick black-framed glasses, three-quarter profile portrait, soft side light, weary wise expression" },
  { id: "09_ch1_machine_reveal", prompt: "Wide shot of a massive worn industrial lithography machine the size of a truck, white panels with scratches faded labels and small rust patches, blue LED accent lights along the base, dramatic chiaroscuro side lighting, almost cathedral-like reverent mood" },
  { id: "10_ch1_hand_on_machine",prompt: "Medium close-up of an older Asian man's weathered hand with visible veins and age spots gently resting on the worn white surface of a large industrial machine, as if patting an old horse, warm side light" },
  { id: "11_ch1_eye_reflection", prompt: "Extreme close-up on a 29 year old Asian woman's brown eye behind clear plastic safety goggles, reflection of a glowing white machine visible in the lens curve, single tear glistening on lower lash, key light from above" },
  { id: "12_ch1_two_shot_wide",  prompt: "Wide low-angle cathedral composition: an older Asian man in white lab coat on the left and a young Asian woman in a yellow clean-room suit on the right standing small in the foreground, a massive industrial machine looms two stories tall behind them with blue accent lights, soft volumetric atmosphere" },
  { id: "13_ch1_phone_capture",  prompt: "Over-the-shoulder shot of a young Asian woman in yellow clean-room suit holding up a smartphone, framing a huge white industrial machine through the screen, soft ambient clean-room lighting" },
  { id: "14_ch1_line_chat",      prompt: "Extreme close-up of a smartphone screen at night showing a soft-focus Thai LINE chat conversation with messages from 'แม่' (Mom), warm screen glow reflecting on darkness around, intimate atmosphere" },
  { id: "15_ch1_lone_corridor",  prompt: "Silhouette of a lone female figure in yellow suit walking down an empty clean-room corridor at end of day, exit light visible in distance, dramatic single-point perspective, melancholic atmosphere" },

  // === Chapter 2 — สองราคา (10) ===
  { id: "16_ch2_two_charts",     prompt: "Dramatic close-up of a laptop screen displaying two divergent financial charts side by side, one crashing downward in red and one soaring upward in green, ambient blue office light reflecting on screen edges" },
  { id: "17_ch2_meeting_chart",  prompt: "Engineers in a dim conference room staring at a large wall projection of stock price graphs, backs of heads silhouetted, somber concentrated atmosphere" },
  { id: "18_ch2_wenli_studying", prompt: "Young Asian woman in reading glasses studying a spreadsheet on her laptop in a dim office at night, single blue screen glow lighting her face, contemplative expression" },
  { id: "19_ch2_newspaper",      prompt: "Tight close-up of fingers holding an open business newspaper, partial Chinese-character headline about chip tariffs visible, window light from left, warm afternoon glow, shallow depth of field" },
  { id: "20_ch2_world_trade",    prompt: "Aerial cinematic map view of the Pacific Ocean with subtle glowing arc lines connecting Asia and North America, semi-abstract geopolitical visualization, blue tones" },
  { id: "21_ch2_cargo_port",     prompt: "Wide industrial shot of cargo ships being loaded with crates at a busy port at sunset, container cranes silhouetted, amber golden hour, scale and stakes" },
  { id: "22_ch2_rare_earth",     prompt: "Wide industrial shot of a rare earth mining operation, yellow heavy trucks, dust haze in golden hour light, vast open pit, sense of enormous scale" },
  { id: "23_ch2_whiteboard",     prompt: "Older Chinese man and young Asian woman standing at a whiteboard in a late-night office, gesturing at hand-drawn graphs, single warm desk lamp lighting, dedicated focused atmosphere" },
  { id: "24_ch2_wenli_window",   prompt: "Asian woman silhouette at a high apartment window at night, reading her phone, city lights of Hefei spread out below, contemplative heavy mood" },
  { id: "25_ch2_wall_of_light",  prompt: "Abstract conceptual image of a vertical glowing wall of pale blue light separating two halves of a dark landscape, atmospheric haze, surreal cinematic, no text" },

  // === Chapter 3 — เอวา (15) ===
  { id: "26_ch3_singapore_sky",  prompt: "Singapore skyline at twilight viewed from a high hotel window, Marina Bay landmarks in distance, harbor lights starting to glow, warm-cool color contrast" },
  { id: "27_ch3_badge_anon",     prompt: "Close-up of a conference attendee badge on a lanyard reading 'Researcher from Institute in China' with no company logo, shallow depth of field, slight melancholy" },
  { id: "28_ch3_wenli_podium",   prompt: "Asian woman scientist at a conference podium presenting, slides with abstract graphs behind her, audience silhouettes blurred in foreground, professional but isolated mood" },
  { id: "29_ch3_restaurant_set", prompt: "Elegant restaurant table set for two at a window overlooking Singapore bay at night, soft candlelight, two glasses of red wine, intimate atmosphere awaiting guests" },
  { id: "30_ch3_eva_portrait",   prompt: "European woman in her early forties with shoulder-length blonde hair, business casual blazer, candid restaurant portrait, warm key light from candle, thoughtful expression" },
  { id: "31_ch3_two_women_talk", prompt: "Two women — one Asian one European — in conversation at an elegant restaurant table, candid moment, Singapore harbor lights visible through window behind, intimate cinematic" },
  { id: "32_ch3_wine_hands",     prompt: "Close-up of two pairs of female hands holding wine glasses across a restaurant table, soft warm light, gentle gesture, suggestive of careful conversation" },
  { id: "33_ch3_eva_window",     prompt: "Pensive close-up of a blonde European woman looking out a restaurant window at Singapore bay at night, soft reflection on glass, contemplative weight in expression" },
  { id: "34_ch3_wenli_listen",   prompt: "Close-up of an Asian woman listening intently at a restaurant table, low warm light, single soft key light on her face, eyes downcast in thought" },
  { id: "35_ch3_wine_bokeh",     prompt: "Close-up of a half-full wine glass on a restaurant table with Singapore city lights in soft bokeh background, contemplative still life" },
  { id: "36_ch3_two_laugh",      prompt: "Two women — one Asian one European — sharing a genuine moment of laughter at a restaurant table, candid hand gestures, warm restaurant lighting, brief moment of connection" },
  { id: "37_ch3_email_inbox",    prompt: "Close-up of an email inbox on a dark monitor screen at night, one unread message highlighted from sender 'Eva de Vries', subject line visible, single screen glow" },
  { id: "38_ch3_send_button",    prompt: "Extreme close-up of an Asian woman's finger hovering above the Enter key on a laptop keyboard, screen glow reflecting on hand, suspended decision moment" },
  { id: "39_ch3_folder",         prompt: "Computer monitor close-up showing a single folder icon labeled in Thai characters, the rest of desktop in soft focus, one email document visible inside, dark moody color grade" },
  { id: "40_ch3_singapore_water",prompt: "Wide shot of Singapore harbor at night, city lights reflecting and rippling on dark water, distant skyline, contemplative cinematic mood" },

  // === Outro (5) ===
  { id: "41_outro_red_folder",   prompt: "Top-down close-up of a single red folder on a dark wooden meeting room desk, one Chinese character '光' (light) printed in gold on the cover, dramatic spotlight" },
  { id: "42_outro_empty_room",   prompt: "Empty conference room after a meeting, scattered chairs slightly askew, single document left on the long table, dim overhead light, sense of weight just left behind" },
  { id: "43_outro_beam_intense", prompt: "Pure black background with a single intense beam of pale blue-white EUV-style light pulsing through darkness, dust particles dancing in the light, building intensity" },
  { id: "44_outro_wenli_window", prompt: "Silhouette of an Asian woman at an apartment window at night, looking out at distant industrial lights of a city, contemplative resolve, cinematic atmosphere" },
  { id: "45_outro_endcard",      prompt: "Wide moody establishing shot of a clean room with a single massive machine visible in the distance through atmospheric haze, blue accent lights, space at top of frame for title text overlay" }
];

const OUTPUT_DIR = path.join(__dirname, "..", "assets", "images-ep1");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generate(item) {
  const url = `https://fal.run/${MODEL}`;
  const body = {
    prompt: `${item.prompt}. ${STYLE_SUFFIX}`,
    image_size: IMAGE_SIZE,
    num_images: 1,
    enable_safety_checker: true
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${res.status} ${errText.slice(0, 200)}`);
  }

  const json = await res.json();
  const imgUrl = json.images?.[0]?.url || json.image?.url;
  if (!imgUrl) throw new Error("No image URL in response: " + JSON.stringify(json).slice(0, 200));

  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`);
  const buffer = await imgRes.buffer();

  const ext = imgUrl.match(/\.(jpe?g|png|webp)/i)?.[1] || "jpg";
  const outPath = path.join(OUTPUT_DIR, `${item.id}.${ext}`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

(async () => {
  console.log(`Generating ${PROMPTS.length} cinematic images via ${MODEL}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  const args = process.argv.slice(2);
  const startIdx = args[0] ? parseInt(args[0], 10) - 1 : 0;
  const endIdx = args[1] ? parseInt(args[1], 10) : PROMPTS.length;
  const slice = PROMPTS.slice(startIdx, endIdx);

  console.log(`Rendering items ${startIdx + 1}–${endIdx} (${slice.length} images)\n`);

  let okCount = 0;
  let failCount = 0;
  for (const item of slice) {
    process.stdout.write(`  ${item.id}... `);
    try {
      const outPath = await generate(item);
      const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(0);
      console.log(`✓ ${sizeKB} KB`);
      okCount++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failCount++;
    }
  }
  console.log(`\nDone — ${okCount} ok, ${failCount} failed.`);
  console.log(`Files in ${OUTPUT_DIR}/`);
  console.log("\nUsage tips:");
  console.log("  npm run images-ep1            # generate all 45");
  console.log("  npm run images-ep1 -- 1 5     # generate items 1–5 only (testing)");
  console.log("  npm run images-ep1 -- 16 25   # regenerate just chapter 2 set");
})();
