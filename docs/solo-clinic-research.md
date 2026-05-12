# Solo Clinic Business Plan — Research Summary

> Compacted context from chat session (May 2026)
> Branch: `claude/research-solo-company-fxyhr`

---

## 1. Context & ผู้ตัดสินใจ

- **ผู้ใช้**: แพทย์เฉพาะทาง (neurology + weight loss)
- **มีอยู่แล้ว**: คลินิกจดทะเบียน + codebase `linebot-AI-health` (LINE bot + LIFF + AI dashboard ใช้ MiniMax API)
- **เป้าหมายเดิม**: สร้างโซโลคอมพานี telehealth แบบ Medvi-style ในไทย
- **สถานะปัจจุบัน**: **pivot จาก remote-first → in-clinic only** เนื่องจากปัญหาด้านการขออนุญาตโฆษณา

---

## 2. Research: โซโลคอมพานี (Solopreneur) Landscape 2026

### Stat ที่สำคัญ
- 82% ของธุรกิจขนาดเล็กในสหรัฐฯ ไม่มีพนักงาน
- Solo-founded startup เพิ่มจาก 23.7% (2019) → 36.3% (mid-2025)
- Anthropic CEO ทำนาย: บริษัทคนเดียวพันล้านดอลลาร์บริษัทแรกในปี 2026
- Solo tech stack ปี 2026: $3K–12K/ปี ลดจาก hiring 95–98%

### 6 โมเดลธุรกิจหลัก
1. **Micro-SaaS** — $5K–50K/เดือน (Pieter Levels $3M ARR)
2. **AI App / AI Wrapper** — Base44 ขาย Wix $80M ใน 6 เดือน, HeadshotPro $300K/เดือน
3. **Content Creator / Course** — Ali Abdaal $5M/ปี
4. **Consulting / Fractional Exec** — $10K–15K/เดือน/ลูกค้า
5. **AI-augmented Agency** — Sarah Chen $420K/ปี ทำงาน 25 ชม./สัปดาห์
6. **Indie product/game** — Stardew Valley, BuiltWith

---

## 3. Case Study: Medvi (Reference Model)

### ตัวเลข
- Founder: Matthew Gallagher (41, ไม่ใช่หมอ)
- เริ่ม กันยายน 2024, ทุน $20K
- ปี 2025: $401M revenue, net margin 16.2%
- ปี 2026 คาดการณ์: $1.8B
- พนักงาน: 2 คน (Matthew + น้องชาย Elliot)

### Value Chain
| Layer | Medvi เก็บเอง | Outsource |
|---|---|---|
| Brand, website, UX | ✓ | |
| Paid ads, marketing | ✓ | |
| Customer relationship | ✓ | |
| Physician review | | CareValidate / OpenLoop |
| Prescription, pharmacy | | Partner |
| Shipping, compliance | | Partner |

### AI Stack (12+ tools)
- Code: ChatGPT, Claude, Grok
- Ad creative: Midjourney, Runway
- Voice CS: ElevenLabs
- Custom AI agents (orchestration)

### Pricing
- Semaglutide injection: $179 first month → $299 refill
- Subscription 3/6/12 เดือน, cash-pay only

### ความเสี่ยงที่เกิดขึ้นจริง
- FDA Warning Letter (Feb 2026) เรื่อง misleading claims
- ลูกค้ารีวิว portal/UX แย่
- Compounded GLP-1 loophole กำลังจะปิด

### บทเรียนสำหรับหมอไทย
- **คุณมี unfair advantage**: เป็นหมอจริง (ไม่ต้อง aggregator), ใช้ branded drug, regulatory risk ต่ำกว่ามาก
- หัวใจ Medvi คือ **"แยกชั้นกฎหมายออกจาก customer experience"**

---

## 4. ตลาดเป้าหมาย: ไทย ปี 2026

### GLP-1
- Mounjaro: ฿11,000–15,000/เดือน
- Ozempic: ฿8,000–12,000/เดือน
- Wegovy: ฿10,000–14,000/เดือน
- ตลาดโต CAGR 17.5% ถึง 2030
- Theptarin study: ผู้ป่วยทั่วไป อายุ 55, BMI 31.5, A1c 7.9

### CGRP / Migraine (niche สำรอง)
- Aimovig, Ajovy, Pontevia, Vyepti — ฿25,000–35,000/เดือน
- Botox PREEMPT — ฿9,900+/3 เดือน

### Customer Persona (เป้าเริ่ม)
- **A**: Working professional 30–45, BMI 27–32, จ่ายได้ ฿10–15K/เดือน
- **C**: Post-partum/PCOS 28–40, จ่ายได้ ฿9–14K/เดือน

---

## 5. Plan เดิม (Remote-first) — ระงับ

### Architecture ที่วางไว้
```
LINE OA / LIFF → server.js → AI MiniMax + Apps Script/Supabase
                                ↓
                Partner pharmacy + lab + cold-chain delivery
```

### Pricing tier ที่ออกแบบ
| Tier | ราคา |
|---|---|
| Trial | ฿4,990 |
| Starter | ฿9,990/เดือน |
| Standard | ฿13,990/เดือน |
| Premium | ฿17,990/เดือน |
| Maintenance | ฿1,990/เดือน |

---

## 6. Pivot Decision: In-Clinic Only

### เหตุผลที่ pivot
- ยื่น สสจ. นนทบุรี → **ไม่อนุมัติ**โฆษณา remote subscription
- ไป อย. กลาง = process ซับซ้อนเกินไป
- ตัดสินใจ stop loss + focus in-clinic

### Compliance Guardrails (ที่ค้นพบระหว่างทาง)
- พ.ร.บ.ยา 2510: **ห้ามโฆษณายาต่อสาธารณะ**
- เบาหวานอยู่ใน prohibited disease list
- ห้ามแสดงชื่อยา, before/after, ตัวเลขรับประกัน, "ดีที่สุด/อันดับ 1"
- ห้าม AI avatar / voice clone หมอ
- ต้องมี: เลขใบอนุญาตสถานพยาบาล, ชื่อแพทย์, เลขโฆษณา, คำเตือน

---

## 7. New Plan: In-Clinic + LINE CRM Model

### สิ่งที่ยังใช้ได้จาก investment เดิม
| Asset | บทบาทใหม่ |
|---|---|
| LINE bot + LIFF + AI dashboard | CRM, retention, follow-up, refill reminder |
| AI health summary | ส่งหลัง visit ทุกครั้ง |
| Subscription concept | Membership program 3/6/12 เดือน |
| Intake form (LIFF) | Pre-visit form ลด admin time |
| Payment integration | LINE Pay/Omise membership |

### สิ่งที่ตัดออก
- Cold-chain delivery partner
- Public TikTok/Meta paid ad
- Drug-related public content
- Remote subscription model

### Marketing Playbook ใหม่ (ไม่ต้องขอ อย.)
1. **Google Business Profile** — Maps SEO, รีวิว, walk-in (ฟรี)
2. **Word-of-mouth program** — refer เพื่อน ลด ฿500–1,000 ทั้งสองฝ่าย
3. **Educational organic content** — TikTok/IG/YouTube ให้ความรู้ ไม่ใช่โฆษณา
4. **Local partnership** — ฟิตเนส, โยคะ, derm/gyno cross-referral, lunch-and-learn HR
5. **คนไข้เดิม goldmine** — LINE broadcast 1–2/เดือน, VIP tier, birthday/annual reminder

### Financial Targets (Revised)
| Metric | 6 เดือน | 12 เดือน |
|---|---|---|
| Active patients | 30–60 | 100–200 |
| MRR | ฿250K–700K | ฿800K–2M |
| Marketing spend | ~฿0–5K/เดือน | ฿5–15K/เดือน |
| Margin | 40–60% | 50–70% |

---

## 8. Content Strategy (ที่ใช้ได้ตอนนี้)

### หลัก: คุณ = หน้าเวที, AI = ผู้ช่วยข้างหลัง
| งาน | ใครทำ |
|---|---|
| หน้า + เสียง | คุณ 100% |
| Brainstorm + script ร่าง | AI (ChatGPT/Claude) |
| คุณแก้ script ให้เป็นภาษาตัวเอง | คุณ |
| Subtitle + cut | AI (CapCut) |
| Thumbnail + graphic | AI (Canva) |
| Verify medical fact | คุณเสมอ |

### Workflow 1 ชม. = content 1 สัปดาห์
1. AI gen 50 หัวข้อ (5 นาที)
2. AI ร่าง 7 scripts (10 นาที)
3. คุณแก้ภาษา (15 นาที)
4. ถ่าย 7 clips (20 นาที)
5. AI subtitle + cut (10 นาที)
6. Review compliance (5 นาที)

### Budget จริง: ฿0–500/เดือน
- Ring light + ขาตั้ง: ฿500–1,000 (one-time)
- CapCut, Canva, ChatGPT: free tier เพียงพอ
- LINE OA: free tier (1,000 broadcast/เดือน)

### Content Pillars
- Educational 40% — physiology, hormone, metabolism
- Myth-busting 25% — IF, fad diets
- Behind-the-scene 20% — clinic day, Q&A
- Social proof 15% — testimonial (blur หน้า + consent), mindset

---

## 9. Technical Assets (Codebase Status)

### มีแล้ว (`server.js`)
- `GET /api/health` — config status
- `GET /api/config` — LIFF ID
- `GET /api/dashboard` — fetch from Apps Script
- `POST /api/ai-summary` — MiniMax summary (Thai)

### ต้องเพิ่ม (สำหรับ in-clinic membership)
- `POST /api/intake` — pre-visit form + AI triage
- `POST /api/membership` — subscription create
- `POST /api/webhook/payment` — LINE Pay / Omise webhook
- `POST /api/appointment` — Google Calendar sync
- `GET /api/prescription/:id` — PDF generation
- LIFF pages: `intake.html`, `membership.html`, `consent.html`

### LINE Platform Capability (validated)
| Feature | ใช้ | ค่าใช้จ่าย |
|---|---|---|
| LINE OA | broadcast, friend | ฟรี (1,000/เดือน) |
| LIFF | embedded web | ฟรี |
| Messaging API | auto-reply, push | ฟรี |
| Rich Menu | navigation | ฟรี |
| LINE Login | auth | ฟรี |
| LINE Pay | recurring billing | 3.0% fee |
| Video Call | telemedicine | ฟรี (1:1) |

### Compliance
- ✅ แพทยสภา 54/2563 — video consult OK
- ✅ E-prescription จากสถานพยาบาลจดทะเบียน
- ⚠️ PDPA — sensitive data ต้องไม่เก็บใน LINE chat, ต้องเก็บใน backend ของตัวเอง

---

## 10. Next Actions

### Immediate (ทำเลย)
1. ปรับ codebase รองรับ in-clinic membership
2. เพิ่ม pre-visit intake form
3. Auto-send AI summary หลัง visit
4. ตั้ง Google Business Profile + ขอรีวิวคนไข้เดิม

### Short-term (1–3 เดือน)
1. ถ่าย educational content stockpile (1 ชม./สัปดาห์)
2. Soft pilot membership กับคนไข้เดิม 5–10 คน
3. Local partnership 2–3 ราย
4. Referral program live

### Open Questions
- คลินิกอยู่ทำเลไหน? (กำหนด Google Maps strategy)
- Capacity รับได้กี่เคส/วัน?
- คนไข้เดิมในระบบมีกี่คน?

---

## Sources

- [Best Solopreneur Business Ideas for 2026 — Simply Business](https://www.simplybusiness.com/resource/best-solopreneur-business-ideas-for-2026-future-proof-high-profit/)
- [The 1-Employee Billion-Dollar Startup — Inc.](https://www.inc.com/leila-sheridan/the-no-employee-billion-dollar-startup-how-ai-is-changing-the-face-of-solopreneurship/91326517)
- [Matthew Gallagher's Medvi — Mirror Review](https://www.mirrorreview.com/news/matthew-gallagher-medvi-telehealth-startup/)
- [Thailand GLP-1 Market Outlook 2030 — Grand View Research](https://www.grandviewresearch.com/horizon/outlook/glp-1-receptor-agonist-market/thailand)
- [Real-World Semaglutide Thai Patients — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10213164/)
- [CGRP Migraine Treatments — OpenHouse Clinic Bangkok](https://openhouseclinic.com/en/insights/new_migraine_treatment_en/)
- [โฆษณายา — กองยา อย.](https://drug.fda.moph.go.th/drug-advertisement/)
- [คู่มือการโฆษณาคลินิกความงาม 2025](https://dgh.agency/news/beauty-clinic-advertising-guidelines-2025/)
- [Online Pharmacies in Thailand — Tilleke & Gibbins](https://www.tilleke.com/insights/online-pharmacies-in-thailand-insights-for-entrepreneurs-and-health-tech-enthusiasts/69/)
- [TikTok Health Influencers Thailand — StarNgage](https://starngage.com/plus/en-us/influencer/ranking/tiktok/thailand/health)
