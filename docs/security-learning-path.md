# Security Learning Path — Solo Clinic Owner Edition

> Goal: เข้าใจวิธีคิดของ attacker เพื่อ defend คลินิก + telemedicine ของตัวเอง
> Audience: หมอที่รัน solo clinic + codebase ของตัวเอง (ไม่ใช่ security professional)
> Time: 6 สัปดาห์ × 2-3 ชม./สัปดาห์ = 12-18 ชั่วโมงทั้งหมด

---

## Part 1: Threat Model — ใครจะแฮกคุณ และทำไม

### Asset ของคุณที่มีค่า
| Asset | มูลค่าให้ attacker | ความเสียหายถ้าโดน |
|---|---|---|
| Patient data (PDPA) | $10-50/record ใน dark market | ปรับ PDPA ถึง 5 ล้านบาท |
| LINE Pay credentials | เงินสด | สูญเงิน + brand trust |
| LINE OA access | ส่ง spam/phishing แทนคุณ | ลูกค้าทั้งหมด |
| Server / hosting account | crypto mining / proxy | bill ขึ้น + downtime |
| Google account | Calendar, Drive, email | ทุกอย่าง |
| Domain | redirect ไป malicious | brand + SEO ตาย |
| Medical license number | impersonation | reputation + legal |

### Attacker Profile (เรียงจากที่เจอบ่อยที่สุด)

1. **Bots / opportunistic scanners** (99% ของ traffic ร้าย)
   - Scan port + common vulnerabilities ทั่ว internet
   - ไม่ได้เจาะจง — คุณแค่อยู่ในรายชื่อ IP
   - **ป้องกันง่าย**: update patch, basic config

2. **Script kiddies** (ลองของ)
   - ใช้ tool สำเร็จรูป (Sqlmap, Burp Suite community)
   - มักโจมตี form submission, login page
   - **ป้องกัน**: input validation, rate limit

3. **Phishers** (พบบ่อยใน healthcare)
   - ส่ง email/LINE มาหาคุณ ขอ reset password
   - ทำเว็บปลอม login Google/LINE
   - **ป้องกัน**: 2FA, awareness

4. **Disgruntled patient / former staff**
   - มี context insider
   - มัก post รีวิวแย่ + อาจ DDoS
   - **ป้องกัน**: access control, log

5. **Organized cybercrime** (rare แต่หนัก)
   - Ransomware-as-a-service
   - Target healthcare เพราะ pay เร็ว
   - **ป้องกัน**: backup, network segmentation

6. **State / advanced** (จะไม่เจอ — skip)

---

## Part 2: Attack Surface Map — Codebase ของคุณ

```
[Internet]
     ↓
[Domain: sahawanclinic.clinic]
     ↓ (DNS)
[Hosting server]
     ↓ (Node.js / Express)
[server.js endpoints]
     ├─ /api/symptom-check ← GPT-4 (ค่า token!)
     ├─ /api/booking/* ← Google Calendar (OAuth)
     ├─ /api/payment/* ← LINE Pay (เงิน!)
     ├─ /api/dashboard ← patient data
     └─ /api/ai-summary
     ↓
[External services]
     ├─ OpenAI API ← key
     ├─ Google Calendar ← service account
     ├─ LINE Pay ← merchant secret
     ├─ LINE Messaging API ← channel token
     └─ Apps Script ← URL
```

### Single points of failure
1. Server `.env` file — มี secret ทุกตัว
2. GitHub repo — ถ้า .env หลุดเข้ามา = หายนะ
3. Your personal email — recovery ทุกบริการ
4. Your phone — 2FA SMS

---

## Part 3: Top 10 Threats ที่คุณจะเจอจริง

### 1. Credential theft via phishing (เจอบ่อยสุด)
**Attack**: email "LINE Pay verification required — click here"
**Defense**:
- 2FA ทุกบริการ (LINE, Google, GitHub, hosting, npm)
- ใช้ password manager (Bitwarden ฟรี)
- ห้าม click link ใน email — เปิด official app เอง
- โดเมน lookalike: `lìne.me` (i = ì)

### 2. Secrets leaked to GitHub
**Attack**: คุณ commit `.env` พลาด → bot ค้น GitHub ทุก 30 วินาที → API key หลุดใน 5 นาที
**Defense**:
- `.gitignore` มี `.env` แล้ว ✓ (ผมเพิ่งทำให้)
- ใช้ `git-secrets` หรือ `gitleaks` scan ก่อน commit
- ตั้ง GitHub secret scanning (ฟรี)
- ถ้าหลุด: rotate ทันที (เปลี่ยน key ทั้งหมด)

### 3. Webhook spoofing (LINE Pay confirm bypass)
**Attack**: attacker เรียก `/api/payment/confirm` โดยไม่ผ่าน LINE → ระบบคุณนึกว่าจ่ายแล้ว
**Defense ของคุณตอนนี้**: ❌ ยังไม่ verify signature → **ต้องเพิ่ม**
**Fix**: verify HMAC + check ว่า transactionId อยู่ใน LINE Pay จริง

### 4. SQL Injection / NoSQL Injection
**Attack**: ใส่ `' OR 1=1 --` ใน form
**ตอนนี้**: คุณยังไม่มี DB → ปลอดภัย
**เมื่อมี Supabase**: ใช้ parameterized queries ทุก query

### 5. Cross-Site Scripting (XSS) ใน LIFF
**Attack**: ใส่ `<script>alert(1)</script>` ใน intake form → ตอนหมอเปิดเคส → script รัน
**Defense**:
- Sanitize ทุก user input ก่อนแสดง
- Use `textContent` ไม่ใช่ `innerHTML` ใน JS
- Content Security Policy header

### 6. Rate limit abuse
**Attack**: เรียก `/api/symptom-check` 10,000 ครั้ง → OpenAI bill ของคุณ $1000 ใน 10 นาที
**Defense**:
- Rate limit ต่อ IP (express-rate-limit)
- Rate limit ต่อ LINE userId
- ตั้ง spending cap ที่ OpenAI dashboard
- Captcha สำหรับ anonymous user

### 7. IDOR (Insecure Direct Object Reference)
**Attack**: เปลี่ยน `?userId=A` เป็น `?userId=B` → ดู dashboard คนอื่น
**Defense**:
- ตรวจ ownership ทุกครั้งก่อน return data
- ใช้ random UUID ไม่ใช่ sequential ID

### 8. Supply chain attack (npm package)
**Attack**: คุณ install `node-fetch` → version ใหม่ถูก hack → upload secrets
**Defense**:
- `npm audit` รายสัปดาห์
- Lock dependency version
- ใช้ Snyk/Dependabot (ฟรี)
- ตรวจ download count + maintainer ก่อน install

### 9. Ransomware (เจอบ่อยใน healthcare)
**Attack**: เปิด PDF จาก "patient" → ทุก file ถูก encrypt → ขอเงิน
**Defense**:
- Backup off-site ทุกวัน (Google Drive + external drive)
- ทดสอบ restore สัปดาห์ละครั้ง
- ห้าม run macro ใน document
- Email/file scan

### 10. Social engineering pretending to be patient
**Attack**: "ผม Dr. X จาก รพ.ใหญ่ ขอข้อมูลคนไข้ใหม่หน่อย"
**Defense**:
- Protocol: verify ผ่าน official channel เท่านั้น
- ห้ามส่ง patient info ทาง LINE/email โดยไม่ verify
- Train ตัวเองและ staff

---

## Part 4: Defensive Code ที่ต้องเพิ่มใน server.js

### Priority 1 (ทำสัปดาห์นี้)
```js
// Rate limiting
const rateLimit = require("express-rate-limit");
app.use("/api/", rateLimit({ windowMs: 60_000, max: 30 }));
app.use("/api/symptom-check", rateLimit({ windowMs: 60_000, max: 5 }));

// Helmet (security headers)
const helmet = require("helmet");
app.use(helmet());

// Body size limit
app.use(express.json({ limit: "100kb" }));
```

### Priority 2 (สัปดาห์หน้า)
- LINE webhook signature verification
- LINE Pay transaction double-verification (call API to confirm)
- Input validation (Zod or Joi)
- Structured logging (Pino)
- Error masking (อย่า leak stack trace)

### Priority 3 (เดือนหน้า)
- WAF / Cloudflare in front
- DB encryption at rest
- Audit log สำหรับทุก patient data access
- Secret rotation schedule

---

## Part 5: 6-Week Learning Curriculum

### Week 1: Foundation + Threat Modeling
- อ่าน OWASP Top 10 (overview) — 1 ชม.
- ทำ TryHackMe "Pre Security" path (ฟรี) — 2 ชม.
- เขียน threat model ของคลินิกตัวเอง — 30 นาที
- Setup password manager + 2FA ทุกบัญชี — 1 ชม.

### Week 2: Web Security Fundamentals
- PortSwigger Web Security Academy: Authentication module (ฟรี) — 3 ชม.
- ทำ TryHackMe "OWASP Top 10" room — 2 ชม.
- Practical: ลอง test login ของตัวเองว่า resist brute force ไหม

### Week 3: Injection & XSS
- PortSwigger Academy: SQL injection + XSS modules — 3 ชม.
- ทำใน lab provided
- Practical: review code `/api/symptom-check` หา input ที่ไม่ sanitize

### Week 4: API + Webhook Security
- API Security Top 10 (OWASP) — 1 ชม.
- HMAC signing/verification — practical exercise — 2 ชม.
- Practical: เพิ่ม signature verification ใน LINE Pay webhook ของคุณ

### Week 5: Cloud + Hosting + Secret Management
- Cloud security fundamentals — 2 ชม.
- Secret management: AWS Secrets Manager / Google Secret Manager / Doppler
- Practical: rotate API keys, set spending caps

### Week 6: Incident Response + Recovery
- "What to do when hacked" playbook — 2 ชม.
- Backup + disaster recovery
- Practical: เขียน IR plan ของคุณเอง 1 หน้า
- ทดสอบ restore backup จริง

---

## Part 6: Free Resources (ใช้ได้ทันที)

### Beginner (ดีที่สุดสำหรับเริ่ม)
- **TryHackMe** (tryhackme.com) — free tier เพียงพอสำหรับ 2 เดือนแรก
- **PortSwigger Web Security Academy** (portswigger.net/web-security) — ฟรีหมด, ดีที่สุดในโลกสำหรับ web sec
- **OWASP Top 10** (owasp.org/Top10) — ต้องอ่าน
- **PicoCTF** (picoctf.org) — CTF สำหรับมือใหม่

### Defender-focused
- **LetsDefend** (letsdefend.io) — blue team labs
- **Blue Team Labs Online** (blueteamlabs.online)
- **Atomic Red Team** (atomicredteam.io) — test detection

### News / Awareness
- **Krebs on Security** (krebsonsecurity.com) — ติดตาม attack จริง
- **The Hacker News** (thehackernews.com)
- **HIBP** (haveibeenpwned.com) — check email ของคุณว่าหลุดไหน

### YouTube (เรียนสบายๆ)
- **NetworkChuck** — networking + intro
- **John Hammond** — practical hacking demo
- **IppSec** — HackTheBox walkthrough (advanced)
- **STÖK** — bug bounty mindset

### Books (ถ้าชอบอ่าน)
- "The Web Application Hacker's Handbook" — Bible ของ web sec
- "Tribe of Hackers" — interview, สั้น อ่านสนุก

---

## Part 7: Practical Defenses Checklist — ทำเลย

### Account-level
- [ ] 2FA ทุกบัญชี (LINE, Google, GitHub, hosting, OpenAI, npm)
- [ ] ใช้ password manager (Bitwarden)
- [ ] เปลี่ยน password ทุก 6 เดือน
- [ ] ลบ session ที่ไม่ใช้

### Code/infra
- [x] `.gitignore` มี `.env` (ผมทำให้แล้ว)
- [ ] เปิด GitHub secret scanning (Settings → Security)
- [ ] `npm audit` ทุกสัปดาห์
- [ ] เพิ่ม rate limit ใน server.js
- [ ] เพิ่ม helmet middleware
- [ ] HTTPS only (Cloudflare ฟรี)
- [ ] Set OpenAI spending cap

### PDPA-specific
- [ ] เก็บ consent log
- [ ] Encrypt patient data at rest
- [ ] Access log ทุกการเปิด record
- [ ] Data retention policy (เก็บกี่ปี?)
- [ ] Breach notification plan (72 ชม.)

### Monitoring
- [ ] Uptime monitoring (UptimeRobot ฟรี)
- [ ] Error tracking (Sentry ฟรี tier)
- [ ] Login alert ทุกบัญชีสำคัญ
- [ ] HIBP alert สำหรับ email คุณ

### Backup
- [ ] Daily backup ไป cloud (Google Drive)
- [ ] Weekly backup ไป external drive
- [ ] Monthly test restore
- [ ] Off-site copy (Drive + local)

---

## Part 8: Mindset — Think Like Attacker

### หลักการ 5 ข้อ
1. **"ทุก input คือ malicious จนกว่าจะพิสูจน์"** — validate ทุกอย่าง
2. **"Least privilege"** — ทุก account/key ทำได้น้อยที่สุดเท่าที่จำเป็น
3. **"Defense in depth"** — ป้องกันหลายชั้น (firewall + rate limit + auth + audit)
4. **"Assume breach"** — สมมุติว่าโดนแล้ว → detect + contain เร็ว
5. **"Boring security"** — patch + backup + 2FA สำคัญกว่า fancy AI security

### คำถามที่ควรถามตัวเองทุกครั้งที่เขียน code
- ถ้า user ส่งข้อมูลผิดจะเกิดอะไร
- ถ้า user ส่ง 10,000 request จะเกิดอะไร
- ถ้า user ปลอม userId จะดู data คนอื่นได้ไหม
- ถ้า server crash จะ leak อะไร
- Secret นี้ถ้าหลุดจะเสียหายแค่ไหน

---

## Part 9: Incident Response Plan (Print + เก็บไว้ที่คลินิก)

ถ้าสงสัยว่าโดนแฮก — ทำตามลำดับ:

1. **Contain** (5 นาทีแรก)
   - ตัด server จาก internet
   - เปลี่ยน password ทุกบัญชี + revoke session
   - Rotate API keys ทุกตัว

2. **Assess** (30 นาที-2 ชม.)
   - ดู log ว่าอะไรเข้าถึง / ออกไป
   - check GitHub commit history
   - check billing dashboards

3. **Notify** (24-72 ชม.)
   - PDPA: แจ้งผู้ใช้ + PDPC ภายใน 72 ชม.
   - แจ้ง LINE Pay / OpenAI / Google ถ้า account ถูก compromise
   - แจ้งทนาย/ที่ปรึกษากฎหมาย

4. **Recover** (3-7 วัน)
   - Restore จาก clean backup
   - Patch vulnerability ที่โดน
   - เปิดระบบกลับมาทีละชิ้น

5. **Learn** (1-2 สัปดาห์)
   - Post-mortem
   - Update SOP
   - Update training

---

## Part 10: Next Steps Concrete (สัปดาห์นี้)

1. **วันนี้** — ตั้ง 2FA ทุกบัญชี (1 ชม.)
2. **พรุ่งนี้** — install Bitwarden + เปลี่ยน password ทุก account ที่ใช้ password ซ้ำ
3. **เสาร์-อาทิตย์** — Sign up TryHackMe + เริ่ม "Pre Security" path
4. **สัปดาห์หน้า** — ผมจะเพิ่ม rate limit + helmet ใน server.js ให้ถ้าต้องการ
5. **เดือนหน้า** — ลง Defender course ของ Microsoft Learn (ฟรี + มี cert)
