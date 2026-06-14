# 📨 Relay to Mac-side agent — Series Build & Upload

> Series: **แสงที่ความยาวคลื่นสิบสามจุดห้า** (slug: `wavelength135`)
> Format: นิยายเสียง 5 ตอนจบ — full-length 1 การ์ด/ตอน (เหมือน Being Mortal)
> Total: 5 episodes covering all 15 chapters of the novel

---

## โครงสร้าง 5 ตอน

| EP | ชื่อ | บทในนิยาย | สถานะ |
|---|---|---|---|
| 01 | ลุง | 1-3 | ✅ Built (ready in ep01/) |
| 02 | หกเปอร์เซ็นต์ | 4-8 | 🟡 Scripts ready, gen pending |
| 03 | กำแพงที่ทำด้วยแสง | 9-11 | 🟡 Scripts ready, gen pending |
| 04 | สิ่งที่ส่งต่อ | 12-14 | 🟡 Scripts ready, gen pending |
| 05 | อีกฝั่งกำแพง (จบ) | 15 | 🟡 Scripts ready, gen pending |

---

## EP1 — Ready to Upload

```bash
cd wavelength135_production/ep01
yt_upload.py ep01-metadata.md ep01.mp4
```

---

## EP2-5 — Build Pipeline

### Step 1: รัน scripts gen ทั้ง audio + images
ทำที่ root ของ repo. ต้องมี `ELEVENLABS_API_KEY` และ `FAL_KEY` ใน `.env` หรือ env.

```bash
npm install   # ครั้งแรกเท่านั้น

# Audio (รันลำดับ — ละทีต่อ EP)
npm run audiobook-ep2
npm run audiobook-ep3
npm run audiobook-ep4
npm run audiobook-ep5

# Images (รันคู่ขนานได้)
npm run images-ep2 &
npm run images-ep3 &
npm run images-ep4 &
npm run images-ep5 &
wait
```

ผลลัพธ์:
- `voiceover-ep2/` ถึง `voiceover-ep5/` — narration .mp3 ต่อ EP
- `assets/images-ep2/` ถึง `assets/images-ep5/` — 45 ภาพ JPG ต่อ EP

### Step 2: Concat audio + build video (ใช้ pipeline `full_episode_build.py`)
ถ้าใช้ format 1 การ์ด/ตอน (เหมือน Being Mortal):

```bash
for EP in 02 03 04 05; do
  # Concat all mp3 in voiceover-ep$EP/ into single file
  cat voiceover-ep$EP/*.mp3 > /tmp/ep${EP}_full.mp3

  # Pick a representative image as card
  CARD="assets/images-ep$EP/09_ch*.jpg"  # หรือเลือก scene ที่เด่นที่สุด
  cp $(ls $CARD | head -1) wavelength135_production/ep$EP/cards/card_main.jpg

  # Build full episode video
  WB_PROD="แสงที่ความยาวคลื่นสิบสามจุดห้า" \
  WB_SERIES="สิบห้าปีของแสง" \
  full_episode_build.py \
    --audio /tmp/ep${EP}_full.mp3 \
    --card wavelength135_production/ep$EP/cards/card_main.jpg \
    --title "$(jq -r .ep$EP wavelength135_production/titles.json)" \
    --out wavelength135_production/ep$EP/ep$EP.mp4
done
```

### Step 3: Upload + playlist (resumable, batch)

Series upload pattern — สร้าง playlist + อัปทุก EP เข้า playlist:

```bash
# ใช้เทมเพลต EXAMPLE_upload.py — อ่าน master.json + titles.json
# จะ:
# 1. สร้าง playlist "แสงที่ความยาวคลื่นสิบสามจุดห้า"
# 2. upload EP1-5 resumable
# 3. เพิ่มทุก EP เข้า playlist
# 4. ตั้ง Unlisted ทุกตัว (ตามค่า default_privacy)
# 5. notifySubscribers=false (no spam)

cd wavelength135_production
python3 ~/.local/bin/EXAMPLE_upload.py --config master.json
```

---

## หมายเหตุ

- **เสียง EP1 ใช้ Liam voice ID** `TX3LPaxmHKxFdv7VOQHJ` + model `eleven_v3` — scripts EP2-5 ใช้ค่าเดียวกัน
- **ภาพ EP1 ใช้ FLUX dev** — scripts EP2-5 ใช้ค่าเดียวกัน, ต้นทุน ~$1/EP
- **Style suffix** เดียวกันทุก EP — โทน Denis Villeneuve cool blue
- **Mp3 EP1 = 9.7MB / 10.5 นาที** — EP อื่นๆ จะใกล้เคียง (15-25 นาที)
- **เรื่องแต่ง** (fiction) ชื่อบริษัทสมมุติทั้งหมด — ปลอดภัยลิขสิทธิ์

## Quota / Cost estimate

| Item | ต่อ EP | รวม EP2-5 |
|---|---|---|
| ElevenLabs (free tier) | ~6K chars | ~24K chars (อาจเกิน free tier — upgrade ถ้าจำเป็น) |
| fal.ai (FLUX dev) | ~$1.13 | ~$4.50 |
| YouTube upload | ~5 quota | ~20 quota (น้อยมาก) |

---

## ขั้นต่อไป (เลือก)

1. **รันให้จบทั้งซีรีส์** — gen + build + upload ทั้ง 5 ตอนทีเดียว
2. **ทีละตอน** — gen EP2 → user ฟัง → ปรับ → gen EP3 → ...
3. **EP2 ก่อน** — เพื่อ verify pattern ก่อนทำเต็มซีรีส์

ส่งลิงก์ YouTube กลับให้ user หลัง upload ทุกตอน.
