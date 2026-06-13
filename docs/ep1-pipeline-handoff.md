# EP1 Handoff — feed into Mac podcast-pipeline

> Series ใหม่: "แสงที่ความยาวคลื่นสิบสามจุดห้า" (สิบห้าปีของแสง)
> ตอนที่ ๑ — องก์ที่ ๑: ลุง / สองราคา / เอวา
> รูปแบบ: full-length 1 การ์ด/ตอน (เหมือน Being Mortal)

---

## Asset ที่ผม gen ไว้แล้ว (sandbox) — ดาวน์โหลดไป Mac

| ไฟล์ | สิ่งที่เป็น | ใช้ใน pipeline |
|---|---|---|
| `ep1_full_narration.mp3` (629s / ~10.5 นาที) | narration เต็มตอน รวม 5 ช่วงแล้ว | **audio input หลัก** |
| `ep1_open/ch1/ch2/ch3/outro.mp3` | narration แยกช่วง | สำรอง (ถ้าอยากใส่เพลงคั่น) |
| `assets/images-ep1/` (45 ภาพ) | ภาพประกอบ cinematic | ใช้เป็น card หรือ b-roll |

> เสียงทั้งหมดสร้างด้วย ElevenLabs voice **Liam** (`TX3LPaxmHKxFdv7VOQHJ`) model `eleven_v3`
> ตรงกับ `say_thai_long` ของ pipeline — ถ้าอยาก regen ฝั่ง Mac ใช้ `SAY_THAI_VOICE_ID=TX3LPaxmHKxFdv7VOQHJ`

---

## รันบน Mac — 6 steps (ตาม README ของ pipeline)

### Step 1 — เตรียม audio
ใช้ `ep1_full_narration.mp3` ที่ผมรวมให้ — ข้าม say_thai ได้เลย
(หรือถ้าจะ regen: ใช้ text จาก `docs/youtube-ep1-audiobook-script.md` → `fix_tts_v2.py` → `say_thai_long`)

### Step 2 — เจน card (fal)
```bash
FAL_KEY=$FAL_KEY FAL_SIZE=1920x1080 fal_gen_cards.py
```
**Card prompt แนะนำ** (1 การ์ดสำหรับตอนนี้):
```
A lone female engineer in a yellow clean-room suit stands small before a
massive worn white lithography machine in a dark semiconductor facility,
a single beam of pale blue-white light cutting through the haze, blue LED
accents on the machine base. Cinematic, Denis Villeneuve aesthetic, cool
blue grade with warm amber accents, volumetric light, photorealistic.
Space at top for title text. 1920x1080.
```
*(หรือใช้ภาพ `assets/images-ep1/09_ch1_machine_reveal.jpg` / `12_ch1_two_shot_wide.jpg` เป็น card เลย — เข้ากับโทนตอนนี้ที่สุด)*

### Step 3 — build full episode
```bash
WB_PROD="แสงที่ความยาวคลื่นสิบสามจุดห้า" \
WB_SERIES="สิบห้าปีของแสง" \
full_episode_build.py \
  --audio ep1_full_narration.mp3 \
  --card <card.png> \
  --title "ตอนที่ ๑ — ลุง"
```
*(ปรับ flag ตาม signature จริงของ `full_episode_build.py` ใน README)*

### Step 4 — face overlay (ถ้าใช้)
```bash
face_overlay.py ...
```

### Step 5 — upload
```bash
yt_upload.py --file ep1_video.mp4 \
  --title "ลุง — แสงที่ความยาวคลื่นสิบสามจุดห้า EP1" \
  --desc-file ep1_description.txt
```

### Step 6 — playlist
```bash
yt_playlist_manage.py --add <video_id> --playlist "สิบห้าปีของแสง"
```

---

## YouTube metadata (พร้อมใช้)

### Title
```
ลุง — แสงที่ความยาวคลื่นสิบสามจุดห้า | ตอนที่ ๑
```

### Description
```
🎧 นิยายเสียง — "แสงที่ความยาวคลื่นสิบสามจุดห้า"
ตอนที่ ๑ • องก์ที่ ๑ — ลุง / สองราคา / เอวา

ปี 2026 ในเมืองเหอเฝย... วิศวกรหญิงคนหนึ่งก้าวเข้าสู่โรงงาน
ที่จะเปลี่ยนชะตาของอุตสาหกรรมชิปทั้งโลก
และเครื่องจักรที่ทุกคนเรียกว่า "ลุง"

นี่คือบทแรกของเรื่องของเธอ — เรื่องของแสง ที่ใช้เวลา 15 ปีกว่าจะติดไฟ

⏱ Timestamps:
0:00 — เปิดเรื่อง
0:17 — บทที่ ๑ ลุง
3:41 — บทที่ ๒ สองราคา
6:22 — บทที่ ๓ เอวา
9:47 — เกริ่นองก์ต่อไป

📖 อ่านเต็มเล่ม (ebook): [link]
🎬 ตอนต่อไป: องก์ที่ ๒ — หกเปอร์เซ็นต์

#นิยายเสียง #audiobook #ชิป #สงครามชิป #geopolitics #aiart
```

### Tags
```
นิยายเสียง, audiobook ไทย, เล่านิยาย, สงครามชิป, semiconductor,
EUV, จีนกับอเมริกา, sci-fi ไทย, geopolitics, นิยายไทย
```

---

## Timestamp ที่แม่นยำ (จาก duration จริง)

| ช่วง | เริ่ม | ไฟล์ |
|---|---|---|
| เปิดเรื่อง | 0:00 | ep1_open (16.8s) |
| บทที่ ๑ ลุง | 0:17 | ep1_ch1 (204.9s) |
| บทที่ ๒ สองราคา | 3:42 | ep1_ch2 (160.8s) |
| บทที่ ๓ เอวา | 6:22 | ep1_ch3 (204.7s) |
| เกริ่นองก์ต่อไป | 9:47 | ep1_outro (42.2s) |
| **จบ** | **10:29** | |

---

## หมายเหตุสำหรับ Mac-side agent

- **เสียงพร้อมแล้ว** — ไม่ต้อง regen TTS ใช้ `ep1_full_narration.mp3` ได้เลย
- ถ้า pipeline ใช้ format "1 การ์ด/ตอน" → เลือกภาพ 1 ใบจาก `assets/images-ep1/` (แนะนำ `09` หรือ `12`) หรือเจนใหม่ด้วย card prompt ข้างบน
- ถ้าอยากแบบ slideshow 45 ภาพ → ผม build เป็น mp4 ไว้แล้วใน sandbox (ทาง B) — ดาวน์โหลดได้
- Series นี้เป็นเรื่องแต่ง (fiction) ชื่อบริษัทสมมุติทั้งหมด — ปลอดภัยเรื่องลิขสิทธิ์
```
