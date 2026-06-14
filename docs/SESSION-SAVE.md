# Session Save — Tetralogy "สายโลก" Complete
## บันทึก: 2026-06-14 (Asia/Bangkok 15:11)

---

## 🎉 ซีรีส์ "สายโลก" — เสร็จสมบูรณ์ทั้ง 4 เล่ม

### 4 นิยายเล่มเต็ม รวม ~93,000 คำ

| เล่ม | ชื่อ | ตัวเอก | Topic | Path |
|---|---|---|---|---|
| **1** | แสงที่ความยาวคลื่นสิบสามจุดห้า | เฉินเหวินลี่ (จีน) | ชิป EUV | `docs/MANUSCRIPT-full-novel-polished.md` |
| **2** | แร่ที่ไม่มีในโต๊ะธาตุ | ปัญญลักษณ์ สุขนธสิงห์ (ไทย/กรีนแลนด์) | แร่ rare earth | `docs/MANUSCRIPT-rare-earth-polished.md` |
| **3** | กริดที่ไม่ดับ | นพมาส รัตนสุขจันทร์ (ไทย/อเมริกา) | ไฟฟ้า AI | `docs/MANUSCRIPT-grid-polished.md` |
| **4** | รหัสที่ไม่ลับอีกแล้ว (จบ) | อาภาพร ตันติวงศ์ (ไทย/อเมริกา) | Quantum crypto | `docs/MANUSCRIPT-quantum-polished.md` |

### Universe — เชื่อมกันสมบูรณ์

4 ผู้หญิง 4 อาชีพ 4 ทวีป — ทำงานในห่วงโซ่อุปทานเดียวกัน:
- เฉิน → ชิป → ใน data center
- ปุณ → แร่ → ทำมอเตอร์/แม่เหล็ก data center
- นพ → ไฟ → ป้อน data center
- อา → รหัส → ปกป้องข้อมูลที่ไหลผ่านทั้งหมด

ปิดในบทสุดท้ายเล่ม 4 (Geneva) — อาคิดถึงทั้งสามคนที่ไม่เคยพบ — "พี่น้องในสายโลก"

### Cross-references ระหว่างเล่ม
- เล่ม 3+4: EGAT post-quantum migration, เจ้าชายขาลีด, Niran Patel
- ทุกเล่ม: ธีม "คนเล็กในห่วงโซ่ใหญ่" + "เกลียดกำแพง ไม่ใช่คน"

---

## 📦 Production Status

### เล่ม 1 — Audiobook Series (ที่ลงมือทำแล้ว)
- ✅ EP1 built (mp4 115MB + audio + 45 images + metadata + cards)
- ✅ EP2-5 scripts (audio + image generators)
- ✅ Production bundle: `wavelength135_production/`
- ✅ Release strategy: `wavelength135_production/RELEASE_STRATEGY.md`
- ⏸ รออัป YouTube (Mac-agent)

### เล่ม 2-4 — Manuscript only
- ✅ Manuscript เต็ม ขัดเกลาแล้ว
- ⏸ ยังไม่มี audiobook scripts (Mac-agent gen จาก manuscript ได้)
- ⏸ ยังไม่ build EPUB/PDF

---

## 🚀 Release Strategy (ที่ user buy)

**Daily release** — trilogy → 17 วัน:
```
Day 1-5    เล่ม 1 (EP1-5)
Day 6      พัก/teaser
Day 7-11   เล่ม 2 (EP6-10)
Day 12     พัก/teaser
Day 13-17  เล่ม 3 (EP11-15)
+ เล่ม 4 (EP16-20) ต่อหลังจากนั้น
+ Shorts daily (teaser ก่อนปล่อย EP)
```

Cross-platform: YouTube + TikTok + IG + FB + Threads
Strategy doc: `wavelength135_production/RELEASE_STRATEGY.md` (มี 15 Shorts scripts)

---

## 📁 โครงสร้าง branch สุดท้าย

```
linebot-AI-health/ (branch: claude/research-solo-company-fxyhr)
├── docs/
│   ├── MANUSCRIPT-full-novel-polished.md     ⭐ เล่ม 1
│   ├── MANUSCRIPT-rare-earth-polished.md     ⭐ เล่ม 2
│   ├── MANUSCRIPT-grid-polished.md           ⭐ เล่ม 3
│   ├── MANUSCRIPT-quantum-polished.md        ⭐ เล่ม 4 (จบ)
│   ├── novel-selling-kit.md
│   ├── SESSION-SAVE.md                        ← ไฟล์นี้
│   └── ... (clinic, security, youtube scripts)
├── scripts/
│   ├── generate-audiobook-ep[1-5].js         # เล่ม 1 audio
│   ├── generate-images-ep[1-5].js            # เล่ม 1 images
│   ├── build-video-ep1.sh / build-ebook.sh
│   └── ...
├── wavelength135_production/
│   ├── master.json / titles.json
│   ├── RELAY_TO_MAC_AGENT.md
│   ├── RELEASE_STRATEGY.md                    ⭐ daily release plan
│   └── ep01/ (built bundle)
├── assets/ (cover + title overlay เล่ม 1)
├── public/ + server.js (clinic project)
└── package.json
```

---

## 💰 ต้นทุนรวม session

| Item | Cost |
|---|---|
| fal.ai (45 ภาพ EP1) | ~$1.13 |
| ElevenLabs (free tier) | $0 |
| **รวม** | **~$1.13** |

**Output**:
- 4 นิยายเล่มเต็ม (93K คำ) ขายได้ทั้ง tetralogy
- 1 audiobook EP1 พร้อมอัป + EP2-5 scripts
- Release strategy 17-day daily plan + 15 Shorts
- Clinic FND strategy + code (จากต้น session)

---

## 🎯 Next steps when resumed

### A — Mac-agent: อัป EP1 + gen EP2-5 → YouTube (เล่ม 1)
### B — เขียน audiobook scripts เล่ม 2-4 (15 EPs ใหม่)
### C — Build EPUB/PDF ทั้ง 4 เล่ม
### D — ทำปกเล่ม 2-4 (fal.ai)
### E — Voice clone เสียง user → regen ทั้งหมดด้วยเสียงตัวเอง
### F — กลับมาทำคลินิก FND

---

## 🎙️ หมายเหตุ Voice Clone (user กำลังทำ)

- user gen เสียงตัวเอง `saharat_thai` ผ่าน **Instant Voice Clone** (IVC) สำเร็จแล้ว
- ทดสอบ TTS ภาษาไทย ใน Eleven v3 model = ใช้งานได้
- **ขั้นต่อไป**: หา Voice ID → ใส่ใน scripts → regen ทั้งซีรีส์ด้วยเสียงตัวเอง

### วิธีใส่ใน scripts

```bash
# 1. ใน ElevenLabs → Voices → คลิก ... ข้าง saharat_thai → Copy voice ID
# 2. ใส่ใน ~/.zshrc
export SAHARAT_VOICE_ID="<paste_id>"

# 3. แก้ scripts/generate-audiobook-ep[1-5].js เปลี่ยน:
const VOICE_LIAM = process.env.SAHARAT_VOICE_ID || "TX3LPaxmHKxFdv7VOQHJ";

# 4. รันใหม่
for EP in 1 2 3 4 5; do npm run audiobook-ep$EP; done
```

→ Audiobook ทั้งซีรีส์ = **เสียงตัวเอง** ระดับ premium personal

### ไฟล์เสียงต้นฉบับที่ตัด (เก็บไว้ตอน clone)

- `saharat_8min_hq.m4a` (8 นาที, 128kbps, 7.4 MB) — ที่ใช้ clone
- backup: 4-min และ full version

---

## Last commits
```
12a6aec  Add Book 4 manuscript — รหัสที่ไม่ลับอีกแล้ว (finale)
b6c00b4  Add hybrid release strategy — 10-week trilogy launch
faa619b  Update session save — trilogy complete
c0fa0ed  Add Book 3 manuscript — กริดที่ไม่ดับ
bfb8280  Add Book 2 manuscript — แร่ที่ไม่มีในโต๊ะธาตุ
```

ทุกอย่าง stable — หยิบมาทำต่อได้ ไม่มีงานค้าง
