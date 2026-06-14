# 📨 Relay to Mac-side agent — Upload EP1

> Series ใหม่: **แสงที่ความยาวคลื่นสิบสามจุดห้า** (slug: `wavelength135`)
> Mode: **2️⃣ Series + playlist** (สร้าง playlist ใหม่ + upload EP1 เข้า playlist)

---

## โครงสร้างที่ส่งมา

```
wavelength135_production/
├── master.json          ← config ซีรีส์ + playlist + รายการตอน
├── titles.json          ← ชื่อตอน ep01-ep15
└── ep01/
    ├── ep01.mp4              ← วิดีโอเต็ม 1080p, 10:29 นาที (พร้อมอัป)
    ├── ep01-metadata.md      ← title/desc/tags/category/privacy
    ├── audio/
    │   └── ep01_narration.mp3   ← narration เต็ม (เผื่อ rebuild)
    └── cards/
        ├── card_main.jpg        ← การ์ดหลัก (เครื่องลุง)
        └── card_alt.jpg         ← การ์ดสำรอง (two-shot วิหาร)
```

---

## คำสั่งอัป (เลือก 1)

### ทางเร็ว — single upload
```bash
cd wavelength135_production/ep01
yt_upload.py ep01-metadata.md ep01.mp4
```
→ ได้ลิงก์ Unlisted ทันที (privacy ตั้งเป็น Unlisted ใน metadata ให้ user ฟังก่อน)

### ทาง series — สร้าง playlist + upload + เข้า playlist
ใช้เทมเพลต `EXAMPLE_upload.py` อ่าน `master.json`:
- สร้าง playlist จาก `master.json.playlist_title` / `playlist_description`
- upload `ep01/ep01.mp4` (resumable, notifySubscribers=false)
- เพิ่มเข้า playlist
- title จาก `titles.json["ep01"]` หรือ `master.json.episodes[0].full_title`

---

## หมายเหตุ
- **Privacy เริ่มต้น = Unlisted** (user อยากฟังก่อน) — เปลี่ยนเป็น Public เมื่อ user OK
- ตอนนี้มีแค่ EP1 — EP2-15 ทยอยส่งตามมา (sandbox gen ทีละตอน)
- เรื่องแต่ง (fiction) ชื่อบริษัทสมมุติ — ปลอดภัยลิขสิทธิ์
- ส่งลิงก์ YouTube กลับมาให้ user ฟัง

## ขั้นต่อไป (sandbox จะทำ)
EP2 "หกเปอร์เซ็นต์" — gen audio + cards + build mp4 → ส่งโครงสร้าง `ep02/` แบบเดียวกัน
