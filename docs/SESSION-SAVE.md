# Session Save — ซีรีส์ 5 ตอนพร้อม Handoff
## บันทึก: 2026-06-14 (Asia/Bangkok 08:17)

---

## ✅ Series Complete — แสงที่ความยาวคลื่นสิบสามจุดห้า (5 ตอน)

### สถานะแต่ละตอน

| EP | ชื่อ | บท | Audio | Images | Video | Status |
|---|---|---|---|---|---|---|
| **01** | ลุง | 1-3 | ✅ generated | ✅ generated | ✅ built (115 MB) | **Ready to upload** |
| **02** | หกเปอร์เซ็นต์ | 4-8 | 🟡 script ready | 🟡 script ready | ⏸ pending | Scripts on GitHub |
| **03** | กำแพงที่ทำด้วยแสง | 9-11 | 🟡 script ready | 🟡 script ready | ⏸ pending | Scripts on GitHub |
| **04** | สิ่งที่ส่งต่อ | 12-14 | 🟡 script ready | 🟡 script ready | ⏸ pending | Scripts on GitHub |
| **05** | อีกฝั่งกำแพง (จบ) | 15 | 🟡 script ready | 🟡 script ready | ⏸ pending | Scripts on GitHub |

### ทุก script + config push GitHub แล้ว
```
https://github.com/saharata/linebot-AI-health/tree/claude/research-solo-company-fxyhr
```

---

## 📁 สิ่งที่อยู่บน GitHub (Mac-agent ดึงไปใช้ได้)

```
linebot-AI-health/
├── docs/                              # 17 ไฟล์ research + scripts + nov
│   ├── MANUSCRIPT-full-novel-polished.md  ⭐ นิยายเต็ม
│   ├── novel-selling-kit.md
│   ├── youtube-ep1-audiobook-script.md
│   ├── youtube-hook-strategy.md
│   ├── ep1-pipeline-handoff.md
│   ├── SESSION-SAVE.md                ← ไฟล์นี้
│   └── ... (clinic project docs)
├── scripts/
│   ├── generate-audiobook-ep[1-5].js  ⭐ 5 audio generators
│   ├── generate-images-ep[1-5].js     ⭐ 5 image generators
│   ├── build-video-ep1.sh             (ffmpeg → mp4)
│   ├── build-ebook.sh                 (manuscript → EPUB + PDF)
│   └── ... (clinic + voice tests)
├── wavelength135_production/          ⭐ Production bundle
│   ├── master.json                    (5-episode config + playlist)
│   ├── titles.json                    (5 episode titles)
│   ├── RELAY_TO_MAC_AGENT.md          ⭐ Mac-agent ใช้คู่มือนี้
│   └── ep01/                          (EP1 บันเดิลครบแล้ว)
│       ├── ep01-metadata.md
│       ├── audio/ep01_narration.mp3
│       └── cards/card_main.jpg + card_alt.jpg
├── public/                            (LIFF — clinic project)
├── server.js                          (Express — clinic project)
└── package.json                       (10 npm run scripts สำหรับ gen)
```

---

## 🎬 Workflow handoff (Mac-agent ทำต่อ)

### 1. Clone branch
```bash
cd ~/Downloads
git clone -b claude/research-solo-company-fxyhr \
  https://github.com/saharata/linebot-AI-health.git wavelength135
cd wavelength135
npm install
```

### 2. ใช้ key Mac-side (ไม่ส่งใน chat)
```bash
cp .env.example .env
# แก้ .env ใส่ ELEVENLABS_API_KEY + FAL_KEY
```

### 3. Gen ทั้งซีรีส์ EP2-5
```bash
for EP in 2 3 4 5; do npm run audiobook-ep$EP; done
for EP in 2 3 4 5; do npm run images-ep$EP & done; wait
```

### 4. Build + upload (ใช้ podcast-pipeline)
```bash
# อ่านคำสั่งครบใน:
cat wavelength135_production/RELAY_TO_MAC_AGENT.md
```

---

## 💰 ต้นทุนรวม session

| Item | EP1 (done) | EP2-5 (รออัป) | รวม |
|---|---|---|---|
| ElevenLabs | free tier ($0) | ~24K chars (อาจเกิน free) | $0-22 |
| fal.ai | ~$1.13 | ~$4.50 | ~$5.63 |
| ffmpeg compute | $0 | $0 | $0 |
| YouTube upload | 0 (Mac) | 0 (Mac) | $0 |
| **รวม** | **~$1.13** | **~$5-27** | **~$6-28** |

---

## 🔐 Security — Keys ที่ revoke แล้ว (✅ ดี)

ทั้ง 2 keys ที่ user paste ในแชตช่วงเช้า — revoke เรียบร้อย (Mac-agent ใช้ key ใหม่ที่อยู่บน Mac เท่านั้น):

| Service | Old key (revoked) | New key location |
|---|---|---|
| fal.ai | `87ac039e...` | `~/.zshrc` บน Mac |
| ElevenLabs | `fd6dffa1...` | Mac-side env |

---

## 📊 สิ่งที่ทำใน session ทั้งหมด

### 1. FND Migraine clinic strategy (จาก session ก่อน)
- ✅ Strategy + marketing plan + 30-day MVP
- ✅ Codebase: LINE bot + LIFF + symptom checker + payment + booking
- ✅ Hosting: Vercel-ready
- 📁 ใน `public/`, `server.js`, `docs/fnd-*`, `docs/in-clinic-*`

### 2. EUV นิยาย "แสงที่ความยาวคลื่นสิบสามจุดห้า"
- ✅ 15 บท ครบ (manuscript polished)
- ✅ EPUB + PDF พร้อมขาย
- ✅ ปก SVG + nano banana cover
- ✅ Selling kit (blurb + แพลตฟอร์ม + pricing)
- ✅ นามปากกา "เหวินลี่"
- 📁 ใน `docs/MANUSCRIPT-*`, `docs/novel-selling-kit.md`, `assets/cover.*`

### 3. หนังสั้น "ลุง" 60 วินาที (จาก session ก่อน)
- ✅ 6 Seedance video clips
- ✅ 5 ElevenLabs voiceover (Alice + Liam)
- ✅ Storyboard + script
- 📁 อยู่บนเครื่อง user (Mac), scripts ใน `scripts/generate-voiceover.js`

### 4. Audiobook series 5 ตอน ⭐ (ทำใหม่ใน session นี้)
- ✅ EP1 พร้อมอัป YouTube (mp4 + metadata + audio + cards)
- ✅ EP2-5 scripts ครบ (audio + images)
- ✅ Master config + titles + relay
- ✅ Build pipeline (ffmpeg + Mac podcast-pipeline)

---

## 🎯 Next steps for Mac-agent

**Priority 1**: Upload EP1 → ได้ลิงก์ unlisted → user ฟัง
```bash
cd wavelength135_production/ep01
yt_upload.py ep01-metadata.md ep01.mp4
```

**Priority 2**: Gen EP2-5 (รวม ~30-60 นาที)
```bash
for EP in 2 3 4 5; do npm run audiobook-ep$EP; done
for EP in 2 3 4 5; do npm run images-ep$EP & done; wait
```

**Priority 3**: Build mp4 + upload เข้า playlist เดียวกัน
ดู `wavelength135_production/RELAY_TO_MAC_AGENT.md`

---

## Last commit
```
49e1e84 — Add EP3-5 scripts + finalize 5-episode series structure
```

ทุกอย่างหยิบมาทำต่อได้ — ไม่ติดอะไรค้าง
