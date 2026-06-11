# CapCut Assembly Guide — "ลุง" Short Film

> เปิดเอกสารนี้ข้างๆ CapCut ทำตามทีละข้อ
> เป้าหมาย: ตัดต่อหนัง 60 วินาที พร้อม upload TikTok ใน ~45 นาที

---

## ก่อนเริ่ม — Checklist ไฟล์

โฟลเดอร์ของคุณควรมี:

```
short-film-uncle/
├── clips/
│   ├── 01_building_dawn.mp4       (Seedance)
│   ├── 02_zipper_hand.mp4         (Seedance)
│   ├── 03_corridor_pov.mp4        (Seedance)
│   ├── 04_machine_reveal.mp4      (Seedance)
│   ├── 05_hand_on_machine.mp4     (Seedance)
│   └── 06_eye_reflection.mp4      (Seedance)
└── voiceover/
    ├── vo_01.mp3
    ├── vo_02.mp3
    ├── vo_03.mp3
    ├── vo_04.mp3
    └── vo_05.mp3
```

ขาด: Mom's chat clip — **ทำตอนนี้เลยก่อน open CapCut** (ดูข้อ 0 ล่าง)

---

## ขั้นที่ 0 — ถ่าย Mom's chat (5 นาที)

1. เปิดมือถือ → LINE
2. สร้างห้องแชตชื่อ "แม่" (chat กับตัวเอง หรือเพื่อน)
3. ส่งข้อความ 3 บรรทัด (รออ่านแล้วค่อยพิมพ์ต่อ):
   - `❤️ สวยจังลูก`
   - `อย่าทำงานหนักเกินไปนะ`
   - `กินข้าวให้ตรงเวลา`
4. **ตั้งกล้องบนโต๊ะ** (มือถืออีกเครื่อง หรือยืมเพื่อน)
5. ห้องแสงสลัวๆ → จอเรืองแสงบนใบหน้า
6. ถือ LINE chat → ถ่ายวิดีโอ **6 วินาที**:
   - 2 วินาทีแรก: เห็นแชตนิ่งๆ
   - 2 วินาทีถัดมา: scroll ขึ้นนิดหน่อย เห็นข้อความทั้งหมด
   - 2 วินาทีท้าย: นิ้วพิมพ์ตอบ "ค่ะแม่ หนูสบายดี"
7. Save เป็น `07_mom_chat.mp4` ในโฟลเดอร์ clips/

**Tips**:
- มือสั่นนิดหน่อยได้ → ดู real
- ปิดไฟห้อง → จอเรืองแสง = mood emotional

---

## ขั้นที่ 1 — Setup CapCut (3 นาที)

1. เปิด CapCut Desktop (ฟรี download capcut.com)
2. คลิก **"New Project"**
3. มุมขวาบน → **Settings** ⚙️:
   - **Resolution**: `1080P (1920×1080)` → ระบบจะเปลี่ยนตาม aspect ratio
4. ใน timeline panel ล่าง → **Aspect Ratio**: เลือก `9:16`
5. **Frame Rate**: `30fps`
6. Save project ตั้งชื่อ: `uncle-final`

---

## ขั้นที่ 2 — Import ทุกไฟล์ (2 นาที)

1. แถบซ้ายบน → **Media** → **Import**
2. เลือก **ทั้ง 7 video clips + 5 mp3** พร้อมกัน
3. กด Open → ขึ้นอยู่ในแถบ media

---

## ขั้นที่ 3 — Timeline assembly (15 นาที)

### ลากตามลำดับ — สำคัญ
ลาก clips ลง **Video Track 1** (V1) ตามลำดับนี้:

| ลำดับ | Clip | ระยะเวลาที่ตัด | เริ่มที่ | จบที่ |
|---|---|---|---|---|
| (Title card) | — สร้างใน step 5 | 4s | 0:00 | 0:04 |
| 1 | 01_building | 5s | 0:04 | 0:09 |
| 2 | 02_zipper | 6s | 0:09 | 0:15 |
| 3 | 03_corridor | 6s | 0:15 | 0:21 |
| 4 | 04_machine | 5s | 0:21 | 0:26 |
| 5 | 05_hand | 7s | 0:26 | 0:33 |
| 6 | 06_eye | 6s | 0:33 | 0:39 |
| 7 | 07_mom_chat | 6s | 0:39 | 0:45 |
| 6 (กลับมา) | 06_eye (loop) | 6s | 0:45 | 0:51 |
| (End card) | — สร้างใน step 5 | 4s | 0:51 | 0:55 |

**วิธีตัดให้พอดี**:
- เลือก clip → ดู panel ขวา → กล่อง **Duration**
- พิมพ์ค่า `5s` หรือ `6.0s` ตามตาราง
- คลิป Seedance ออกมา 4 วินาที → ขยายด้วย **Speed: 0.8x** (ช้าลง 20% เพื่อยืดเป็น 5s)
  - Right-click clip → Speed → Normal → 0.8

### ลาก voiceover ลง Audio Track (A1)

| Audio | ลาก start ที่ | จบที่ |
|---|---|---|
| vo_01 | 0:04 | 0:09 |
| vo_02 | 0:09 | 0:15 |
| vo_03 | 0:15 | 0:21 |
| (เงียบ) | 0:21 | 0:26 | ← clip 4 ไม่มี VO ปล่อยเพลงเล่น |
| vo_04 | 0:26 | 0:33 |
| vo_05 | 0:33 | 0:51 | ← ยาวข้าม 3 clip (eye → mom → eye) |

---

## ขั้นที่ 4 — Color grade ให้ทุก clip เป็นชุดเดียวกัน (5 นาที)

1. เลือก **clip แรก** (01_building)
2. Panel ขวา → **Adjust**
3. ตั้งค่าตามนี้:
   - **Temperature**: `-12`
   - **Tint**: `+5`
   - **Highlight**: `-10`
   - **Shadow**: `+5`
   - **Saturation**: `-8`
   - **Contrast**: `+10`
4. คลิกขวา → **Copy** → เลือกทุก clip ที่เหลือ → **Paste Style**

**ผลลัพธ์**: ทุก clip จะมีโทน teal-blue เดียวกัน = cinematic continuity

---

## ขั้นที่ 5 — สร้าง Title + End card (5 นาที)

### Title card (0:00–0:04)

1. แถบบน → **Text** → **Default text**
2. ลากลง timeline ที่ตำแหน่ง 0:00
3. ปรับ duration เป็น 4 วินาที
4. Background: คลิกซ้ายของ timeline → **Add Background** → สีดำ
5. แก้ text เป็น 2 บรรทัด:
   - บรรทัด 1: `合肥 · 2026年三月`
   - บรรทัด 2 (เล็กกว่า): `Hefei · มีนาคม 2026`
6. Style:
   - Font: `Noto Serif SC` (สำหรับจีน) / `Sarabun` (สำหรับไทย)
   - Color: ขาว `#FFFFFF`
   - Size: 80 (บรรทัด 1), 36 (บรรทัด 2)
   - Spacing ระหว่างบรรทัด: 20
7. Animation:
   - **In**: Fade in 0.5s
   - **Out**: Fade out 0.5s

### End card (0:51–0:55)

ทำเหมือนกัน แต่ text:
```
เรื่อง: แสงที่ความยาวคลื่นสิบสามจุดห้า
บทที่ 1 — ลุง

ตอนต่อไป: สองราคา
```

---

## ขั้นที่ 6 — Background music (10 นาที)

### ดาวน์โหลดเพลง (ฟรี)

**Pixabay Music** (ฟรี ไม่ต้อง credit):
1. ไป https://pixabay.com/music/search/cinematic%20piano/
2. ค้นเพิ่ม: `melancholic piano`, `ambient drone`, `contemplative`
3. เลือก BPM ช้า ~60-70
4. แนะนำเพลงที่ work:
   - `Cinematic Documentary` series
   - `Ambient Piano` series
   - `Emotional Background`

### ใส่ใน CapCut

1. ลาก mp3 เพลงลง **Audio Track 2** (A2) ที่ตำแหน่ง 0:00
2. ตัดเพลงให้พอดี 55 วินาที (คลิป + title + end card)
3. **Volume**: 
   - Background music: `-18 dB` (เบา)
   - Voiceover: `0 dB` (ดัง)
4. **Audio Ducking** (สำคัญ):
   - คลิกขวาที่ track เพลง → **Auto Volume**
   - หรือ manual: ตรงที่ VO เล่น → key frame volume เพลงลด -8dB
5. **Fade in**: 2 วินาทีแรก เพลงค่อยๆ ดัง
6. **Fade out**: 4 วินาทีสุดท้าย เพลงค่อยๆ จาง

---

## ขั้นที่ 7 — Special effects (5 นาที)

### Title card → clip 01 transition
- เลือก title card clip → Panel ขวา → **Animation** → **Out: Fade**

### Clip 06 (eye) — slow motion
- เลือก clip → Speed → **0.8x** → จะดู contemplative กว่า

### Clip 07 (mom chat) — slight zoom in
- เลือก clip → Panel ขวา → **Basic** → **Scale**:
  - Start: 1.0 (frame แรก)
  - End: 1.05 (frame สุดท้าย — key frame)

### Vignette ตลอดเรื่อง (optional)
- New adjustment layer บน V2 ครอบทุก clip
- Effects → **Vignette** → ใส่บางๆ

---

## ขั้นที่ 8 — Final check (5 นาที)

### Preview เต็มจอ
- กด **Spacebar** เล่นตั้งแต่ต้น
- เช็ค:
  - [ ] เสียงพากย์ตรงกับภาพ
  - [ ] เพลงไม่กลบ voiceover
  - [ ] ไม่มี gap เงียบ
  - [ ] Title/End card อ่านชัด
  - [ ] Color tone สม่ำเสมอ
  - [ ] ความยาวรวม ~55-60 วินาที

### ปรับ volume สุดท้าย
- Panel **Audio Mixer** ขวาล่าง
- VO peak ที่ -6 dB
- Music peak ที่ -18 dB

---

## ขั้นที่ 9 — Export (3 นาที)

1. มุมขวาบน → **Export**
2. Settings:
   - **Resolution**: `1080P`
   - **Frame rate**: `30 fps`
   - **Bitrate**: `8 Mbps` (Recommended)
   - **Codec**: `H.264`
   - **Format**: `MP4`
   - **Smart HDR**: Off
3. Save as: `uncle-final.mp4`
4. รอ export ~2-3 นาที

---

## ขั้นที่ 10 — Upload (5 นาที)

### TikTok
- Open TikTok app → + → Upload
- เลือก `uncle-final.mp4`
- **อย่า**ใช้ filter ของ TikTok (ฟิลเตอร์ทับ color grade ของเรา)
- Caption:

```
"ลุง" — บทแรกจากนิยายเรื่องสั้น
แสงที่ความยาวคลื่นสิบสามจุดห้า

#shortfilm #aifilm #หนังสั้น #cinematic #seedance
```

### Cross-post
- IG Reels: download จาก TikTok → upload IG
- YouTube Shorts: upload เดียวกัน เพิ่ม #shorts
- Threads: post + description ยาวขึ้น

---

## Troubleshooting

| ปัญหา | วิธีแก้ |
|---|---|
| Voiceover เร็วเกิน | เพิ่ม pause ก่อน-หลัง (drag edge) |
| ภาพสั้นเกิน VO | Speed clip ลดเหลือ 0.7x |
| เพลงดังกว่า VO | Auto Volume → On / key frame volume -10dB ตอน VO |
| Title อ่านไม่ทัน | เพิ่ม duration เป็น 5s |
| Export ช้า | ลด Bitrate เป็น 6 Mbps |

---

## หลังเสร็จ

ส่ง link TikTok กลับมาให้ผมดู — เพื่อ:
1. Feedback ตัวจริงก่อน scale ไปบทอื่น
2. ตัดสินใจว่าทำบทต่อไปไหม ("สองราคา" / "เอวา")
3. หรือเริ่มหนังสั้นเรื่องใหม่จาก niche อื่น
