#!/bin/bash
# Build EP1 audiobook video from narration + 45 Ken Burns still images.
# Output: assets/ep1-video.mp4  (1920x1080, ~10.5 min)
set -e
cd "$(dirname "$0")/.."

AUDIO_DIR="voiceover-ep1"
IMG_DIR="assets/images-ep1"
WORK="$(mktemp -d)"
FPS=30
OUT="assets/ep1-video.mp4"

echo "Work dir: $WORK"

# --- 1. Concat audio (open -> ch1 -> ch2 -> ch3 -> outro) ---
cat > "$WORK/audio.txt" <<EOF
file '$(pwd)/$AUDIO_DIR/ep1_open.mp3'
file '$(pwd)/$AUDIO_DIR/ep1_ch1.mp3'
file '$(pwd)/$AUDIO_DIR/ep1_ch2.mp3'
file '$(pwd)/$AUDIO_DIR/ep1_ch3.mp3'
file '$(pwd)/$AUDIO_DIR/ep1_outro.mp3'
EOF
ffmpeg -y -f concat -safe 0 -i "$WORK/audio.txt" -c copy "$WORK/full_audio.mp3" 2>/dev/null
echo "Audio concatenated."

# --- 2. Per-section durations (seconds) and image counts ---
# open 16.770612 / 3 imgs ; ch1 204.930612 / 12 ; ch2 160.757551 / 10 ; ch3 204.747755 / 15 ; outro 42.187755 / 5
# Map each image index (0-based, sorted) to a display duration.
declare -a IMG_DUR
# open: idx 0..2
for i in 0 1 2;            do IMG_DUR[$i]=5.5902;  done
# ch1: idx 3..14
for i in $(seq 3 14);      do IMG_DUR[$i]=17.0776; done
# ch2: idx 15..24
for i in $(seq 15 24);     do IMG_DUR[$i]=16.0758; done
# ch3: idx 25..39
for i in $(seq 25 39);     do IMG_DUR[$i]=13.6498; done
# outro: idx 40..44
for i in $(seq 40 44);     do IMG_DUR[$i]=8.4376;  done

# --- 3. Generate Ken Burns clip per image ---
mapfile -t IMAGES < <(ls "$IMG_DIR"/*.jpg | sort)
echo "Found ${#IMAGES[@]} images. Rendering clips..."

CONCAT="$WORK/clips.txt"
: > "$CONCAT"

idx=0
for img in "${IMAGES[@]}"; do
  dur="${IMG_DUR[$idx]}"
  frames=$(python3 -c "print(int(round($dur*$FPS)))")
  clip="$WORK/clip_$(printf '%02d' $idx).mp4"

  # Alternate zoom-in / zoom-out for visual variety
  if (( idx % 2 == 0 )); then
    zexpr="1.0+0.12*on/$frames"   # zoom in 1.00 -> 1.12
  else
    zexpr="1.12-0.12*on/$frames"  # zoom out 1.12 -> 1.00
  fi

  ffmpeg -y -loop 1 -i "$img" -t "$dur" -r $FPS \
    -vf "scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='$zexpr':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=$FPS,format=yuv420p" \
    -c:v libx264 -preset veryfast -crf 20 -an "$clip" 2>/dev/null

  echo "file '$clip'" >> "$CONCAT"
  printf "  [%2d/45] %s (%.1fs)\n" $((idx+1)) "$(basename "$img")" "$dur"
  idx=$((idx+1))
done

# --- 4. Concat all clips into the video track ---
echo "Concatenating clips..."
ffmpeg -y -f concat -safe 0 -i "$CONCAT" -c copy "$WORK/video.mp4" 2>/dev/null

# --- 5. Mux video + audio, add gentle fade in/out ---
echo "Muxing audio + video..."
ffmpeg -y -i "$WORK/video.mp4" -i "$WORK/full_audio.mp3" \
  -filter_complex "[0:v]fade=t=in:st=0:d=1.5[v]" \
  -map "[v]" -map 1:a \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest "$OUT" 2>/dev/null

echo ""
echo "Done -> $OUT"
ffprobe -v error -show_entries format=duration:stream=width,height -of default=noprint_wrappers=1 "$OUT"
du -h "$OUT"
rm -rf "$WORK"
