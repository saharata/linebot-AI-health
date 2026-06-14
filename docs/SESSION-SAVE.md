# Session Save — EP1 พร้อมอัป, EP2-15 รอ
## บันทึก: 2026-06-14 (Asia/Bangkok 07:33)

---

## ✅ EP1 — เสร็จสมบูรณ์ พร้อมอัป YouTube

### Asset ทั้งหมด

| ไฟล์ | ที่อยู่ใน sandbox | บน GitHub | ในแชต |
|---|---|---|---|
| Manuscript polished | `docs/MANUSCRIPT-full-novel-polished.md` | ✅ | — |
| Audiobook script | `docs/youtube-ep1-audiobook-script.md` | ✅ | — |
| Pipeline handoff | `docs/ep1-pipeline-handoff.md` | ✅ | — |
| master.json + titles.json | `wavelength135_production/` | ✅ | ✅ |
| RELAY_TO_MAC_AGENT.md | `wavelength135_production/` | ✅ | ✅ |
| ep01-metadata.md | `wavelength135_production/ep01/` | ✅ | ✅ |
| Narration 5 mp3 แยก + 1 รวม | `voiceover-ep1/`, `wavelength135_production/ep01/audio/` | ✅ (รวม) | ✅ |
| 45 ภาพ cinematic (fal.ai) | `assets/images-ep1/` | ❌ (gitignored) | ✅ (zip) |
| Card 2 ใบ | `wavelength135_production/ep01/cards/` | ✅ | ✅ |
| ep01.mp4 (115 MB) | `assets/ep1-video.mp4`, `wavelength135_production/ep01/ep01.mp4` | ❌ (เกิน limit) | ✅ (5 chunks + zip) |

### URL ดาวน์โหลด GitHub

```
Branch zip:
https://github.com/saharata/linebot-AI-health/archive/refs/heads/claude/research-solo-company-fxyhr.zip

Folder ep01:
https://github.com/saharata/linebot-AI-health/tree/claude/research-solo-company-fxyhr/wavelength135_production
```

### Upload status

- [ ] ดาวน์โหลดจาก GitHub / chunks ในแชต → Mac
- [ ] Unzip + รวม mp4 chunks
- [ ] Mac-agent อ่าน `RELAY_TO_MAC_AGENT.md`
- [ ] `yt_upload.py ep01-metadata.md ep01.mp4` → ได้ลิงก์ Unlisted
- [ ] ฟังที่ YouTube → ถ้า OK เปลี่ยน Public

---

## 🟡 EP2-15 — รอเริ่ม (workflow พร้อม)

### ตอนที่จะทำต่อ (ตาม titles.json)

| EP | ชื่อ | บทในนิยาย |
|---|---|---|
| 02 | หกเปอร์เซ็นต์ | บท 4-8 (act 2) |
| 03 | เอวา (กำแพง) | merged into 02 if shorter |
| 04 | สิ่งที่อยู่ในกล่อง | — |
| 05 | จดหมายที่ไม่ถูกส่ง | — |
| ... | ... | ... |
| 15 | เครื่องแรก และจดหมาย | บทสุดท้าย |

### Workflow ที่พิสูจน์แล้วจาก EP1 (ทำซ้ำได้)

1. **Audiobook script** — copy บทจาก `MANUSCRIPT-full-novel-polished.md` ใส่ใน `scripts/generate-audiobook-epN.js`
2. **Narration**: `npm run audiobook-ep1` (ปรับเป็น ep2) → ~5 ไฟล์ mp3
3. **Concat audio**: ffmpeg → `epN_full_narration.mp3`
4. **45 ภาพ**: ปรับ prompts ใน `scripts/generate-images-ep1.js` → `npm run images-ep1` → ~$1
5. **Build video**: `bash scripts/build-video-ep1.sh` ปรับ paths → mp4
6. **Bundle**: structure `wavelength135_production/epN/` แบบเดียวกัน
7. **Send**: GitHub push (small files) + chunks ในแชต (mp4)
8. **Mac-agent อัป**

### ต้นทุนต่อตอน
- fal.ai 45 ภาพ: ~$1
- ElevenLabs: free tier (10K chars/month — 15 ตอนอาจเกิน, ต้อง upgrade)
- Compute: $0
- **รวม: ~$1/EP × 15 = ~$15** สำหรับซีรีส์ทั้งหมด

---

## 🔐 Security — ต้องทำก่อนปิด session

แชตนี้ log key 2 ตัว — **rotate ก่อนปิด**:

| Service | Key (ตัด) | ที่ rotate |
|---|---|---|
| fal.ai | `87ac039e-600d-4dd3-8fd2-...` | https://fal.ai/dashboard/keys |
| ElevenLabs | `fd6dffa17...` | https://elevenlabs.io → Profile → API Keys |

---

## 📁 โครงสร้าง repo สุดท้าย

```
linebot-AI-health/
├── docs/                          # 14 ไฟล์ research + script + nov
│   ├── MANUSCRIPT-full-novel-polished.md  ⭐ นิยายเต็ม
│   ├── novel-selling-kit.md
│   ├── youtube-ep1-audiobook-script.md
│   ├── youtube-hook-strategy.md
│   ├── ep1-pipeline-handoff.md
│   ├── fnd-migraine-strategy.md
│   ├── short-film-uncle-shotlist.md
│   └── ...
├── scripts/
│   ├── generate-voiceover.js          (5 short VO สำหรับหนัง EP1)
│   ├── generate-audiobook-ep1.js      (5 long VO สำหรับ audiobook)
│   ├── generate-images-ep1.js         (45 ภาพ fal.ai)
│   ├── build-video-ep1.sh             (ffmpeg → mp4)
│   ├── build-ebook.sh                 (manuscript → EPUB + PDF)
│   └── test-thai-voices.js            (A/B test)
├── wavelength135_production/      ⭐ Production bundle
│   ├── master.json
│   ├── titles.json
│   ├── RELAY_TO_MAC_AGENT.md
│   └── ep01/
│       ├── ep01-metadata.md
│       ├── audio/ep01_narration.mp3
│       └── cards/card_main.jpg, card_alt.jpg
├── assets/
│   ├── cover.svg/png
│   ├── title-overlay.svg/png
│   └── (gitignored: images-ep1/, ep1-video.mp4, novel.epub, novel.pdf, chunks/)
├── public/                        (LIFF pages — clinic project ที่ทำก่อนหน้า)
│   ├── screener.html
│   ├── booking.html
│   └── ...
├── server.js                       (Express — clinic project)
└── package.json
```

## 🎬 Workspace อื่นที่มีใน session (ไม่ใช่ EP1)

| โปรเจกต์ | สถานะ |
|---|---|
| FND Migraine clinic strategy + MVP code | ✅ Complete in `docs/` + `server.js` |
| EUV นิยาย 15 บท + EPUB + PDF | ✅ Complete |
| ปกหนังสือ SVG | ✅ Complete |
| Cover photoreal (nano banana) | ⚠️ user มีภาพ แต่ผมไม่มีในเครื่อง |
| หนังสั้น "ลุง" 60s (Seedance) | ✅ Complete (จาก session ก่อน) |

---

## ต่อจากตรงนี้

**ทันที**: รวม chunks → unzip → Mac-agent อัป EP1
**ถัดไป**: เริ่ม EP2 ด้วย workflow เดียวกัน

ทุกอย่างที่ทำใน session นี้ push อยู่ใน branch `claude/research-solo-company-fxyhr` หยิบมาทำต่อเมื่อไหร่ก็ได้
