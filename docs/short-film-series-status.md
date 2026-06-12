# Short Film Series — Production Status

> Last updated: 2026-06-12
> Project: "แสงที่ความยาวคลื่นสิบสามจุดห้า" — series adaptation of EUV novel

---

## ✅ EP1 — "ลุง" (COMPLETE)

**Status**: Edited in CapCut, exported, ready for upload
**Duration**: ~50 seconds
**Format**: 9:16 vertical, 1080×1920, 30fps H.264

### Assets used
- **6 Seedance clips** (480p, 4s each, 9:16) — total 144 credits
  - 01_building_dawn
  - 02_zipper_hand
  - 03_corridor_pov
  - 04_machine_reveal
  - 05_hand_on_machine
  - 06_eye_reflection
- **1 phone-shot clip**: 07_mom_chat (LINE screen recording)
- **5 ElevenLabs voiceovers** on `eleven_v3` model
  - Alice (XB7hH8MSUJpSbSDYk0k2) — Wenli x3
  - Liam (TX3LPaxmHKxFdv7VOQHJ) — Wang x2
- **Title card**: 合肥 · 2026年三月 / Hefei · มีนาคม 2026
- **End card**: ตอนต่อไป — สองบาท

### Production workflow that worked
1. **Seedance prompts**: 30-50 words, no text in image, cinematic descriptors
2. **Image consistency**: Reused machine aesthetic (worn white + warnings) across shots 5+6
3. **Color grade**: Temp -12 / Tint +5 / Sat -8 (applied to all clips uniformly)
4. **Audio mix**: VO at 0 dB, music at -18 dB, ducking on VO segments
5. **Speed adjustment**: 0.6–0.8x on Seedance clips to extend 4s → 5-7s

### Lessons learned
- ❌ Title text generation in Seedance — broken (Thai+Chinese garbled)
- ✅ Solution: black background gen, text overlay in CapCut
- ❌ Default English voices on multilingual_v2 — heavy accent
- ✅ Solution: eleven_v3 model + voice A/B test before commit
- ❌ Magnetic snap in CapCut — fights manual positioning
- ✅ Solution: toggle off with `N` key

---

## 🟡 EP2 — "สองราคา" (WAITING FOR CREDITS)

**Theme**: Market bifurcation 2027 — glut at the bottom, scarcity at the top
**Emotional core**: First moment Wenli realizes engineering = battlefield
**Estimated credits**: 144 (same 6-shot structure)

### Pre-staged Seedance prompts

```
SHOT 1 — Stock market reaction
Macro close-up of a financial trading screen at dusk. A single
DRAM price chart crashes downward in red while another HBM chart
climbs in green. Reflections of city lights on the screen surface.
Cool blue-white office light. Tense, sterile mood. 9:16, 4s.
```

```
SHOT 2 — Newspaper headline
Tight close-up of fingers holding a newspaper. The headline mentions
trade tariffs in Chinese characters, partially out of focus.
Window light from left, warm afternoon glow. Photorealistic.
Shallow depth of field. 9:16, 4s.
```

```
SHOT 3 — Wenli at desk reading
Medium shot of a young Asian woman in a clean-room suit sitting at
a desk, illuminated only by laptop screen. Her expression shifts from
neutral to deep concern as she reads. Dark room, blue screen glow on
her face. Cinematic, contemplative. 9:16, 4s.
```

```
SHOT 4 — Wang explanation
Medium two-shot. Older Asian man in white coat gestures at a wall
chart showing two diverging lines. Younger Asian woman in yellow
suit listens intently. Soft fluorescent lab lighting. Documentary
style realism. 9:16, 4s.
```

```
SHOT 5 — Rare earth shipment
Wide industrial shot of crates being loaded onto a cargo train at a
sprawling mining facility. Yellow warning lights flashing. Smoke
rising into amber dusk sky. Cinematic scale. 9:16, 4s.
```

```
SHOT 6 — Wenli at window
Silhouette of a young Asian woman standing at a large window
overlooking a city at night. City lights reflecting in the glass.
She holds a tablet showing the divergent price charts. Contemplative,
heavy. 9:16, 4s.
```

### Voiceover script (pre-written)

```
VO_01 (Alice): "ตอนนั้น... ฉันยังคิดว่ามันเป็นแค่ตัวเลข"
VO_02 (Alice): "แต่ตัวเลขนั้น... กำลังเขียนชะตาของคนกี่ล้านคน"
VO_03 (Alice): "หนึ่งราคา ตกฮวบ — อีกหนึ่งราคา พุ่งฟ้า"
VO_04 (Liam): "เราชนะที่ชั้นล่าง... แพ้ที่ชั้นบน"
VO_05 (Liam): "ตรงนั้นต่างหาก — คือกำแพงที่ทำด้วยแสง"
```

---

## 🟡 EP3 — "เอวา" (WAITING FOR CREDITS)

**Theme**: The conference in Singapore 2028 — two engineers, one wall between them
**Emotional core**: Most human-driven of the series; quiet drama
**Estimated credits**: 144

### Shot list outline
1. Singapore skyline from hotel window
2. Conference badge close-up
3. Wenli presenting (back of head, audience blurred)
4. Eva's hands holding wine glass at dinner
5. Two-shot at restaurant table — silent moment
6. Email inbox — message that was never replied

### Voiceover pre-write
```
VO_01 (Alice/Eva-voice): "We're trying to do what you already did 15 years ago"
VO_02 (Alice/Eva-voice): "And we know how hard it was — because we read your work"
VO_03 (Alice/Eva-voice): "The wall isn't permanent. Physics doesn't pick sides"
VO_04 (Alice/Eva-voice): "But it'll last just long enough — that your generation
                         and mine — won't talk like this again"
VO_05 (Alice/Wenli):    "I never replied. But I never deleted the email either"
```

---

## 📋 Resume checklist when credits return

- [ ] Top up Seedance credits (target: 300+ for 1 episode + retries)
- [ ] Run EP2 shots in order (1 → 6) with pre-staged prompts above
- [ ] Generate EP2 voiceovers via `npm run voiceover` (update SHOTS array first)
- [ ] CapCut: same template as EP1 (color grade + title card + audio mix)
- [ ] Export 9:16 1080×1920 H.264
- [ ] Upload TikTok / IG Reels / YouTube Shorts as series
- [ ] Track engagement: which episode performs best → guide EP3 style

---

## 🎯 Series strategy

- **Drop cadence**: 1 episode per week (build anticipation, allow editing time)
- **Cross-platform**: TikTok primary, IG Reels secondary, YouTube Shorts tertiary
- **Hashtag set**: `#shortfilm #aifilm #หนังสั้น #cinematic #seedance #elevenlabs`
- **End-card hook**: Always tease next episode title (drives subscribe/follow)
- **Series description**:
  > "นิยายสั้นเรื่อง 'แสงที่ความยาวคลื่นสิบสามจุดห้า' — 5 บทเล่าผ่านหนังสั้น
  > เรื่องของคนทำชิปสองฝั่งกำแพง สิบห้าปีของวิศวกรหญิงคนหนึ่ง"

---

## Budget recap (EP1)

| Item | Cost |
|---|---|
| Seedance credits | 144 (≈ 22-day free quota) |
| ElevenLabs (v3) | ~5,000 chars (within free tier) |
| CapCut | Free |
| Pixabay music | Free |
| Phone recording (mom chat) | Free |
| **Total cash spent** | **~฿0** |
| **Time invested** | ~3 hours |

EP2 + EP3 will follow same budget profile when credits available.
