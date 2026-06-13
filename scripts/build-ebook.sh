#!/bin/bash
# Build novel EPUB + PDF from the polished manuscript
# Usage: bash scripts/build-ebook.sh [cover-image-path]
#
# Defaults to assets/cover.png if no cover argument is given.
# To use the nano-banana cover, save it as assets/cover-banana.png and run:
#   bash scripts/build-ebook.sh assets/cover-banana.png

set -e
cd "$(dirname "$0")/.."

MANUSCRIPT="docs/MANUSCRIPT-full-novel-polished.md"
COVER="${1:-assets/cover.png}"
OUT_EPUB="assets/novel.epub"
OUT_PDF="assets/novel.pdf"

if [ ! -f "$MANUSCRIPT" ]; then
  echo "Manuscript not found: $MANUSCRIPT" >&2
  exit 1
fi
if [ ! -f "$COVER" ]; then
  echo "Cover not found: $COVER" >&2
  exit 1
fi

echo "Building EPUB with cover: $COVER"
pandoc "$MANUSCRIPT" \
  -o "$OUT_EPUB" \
  --metadata title="แสงที่ความยาวคลื่นสิบสามจุดห้า" \
  --metadata author="เหวินลี่" \
  --metadata lang=th \
  --toc \
  --toc-depth=2 \
  --epub-cover-image="$COVER"
echo "  -> $OUT_EPUB ($(du -h "$OUT_EPUB" | cut -f1))"

echo "Building PDF"
pandoc "$MANUSCRIPT" \
  -o "$OUT_PDF" \
  --metadata title="แสงที่ความยาวคลื่นสิบสามจุดห้า" \
  --metadata author="เหวินลี่" \
  --pdf-engine=weasyprint
echo "  -> $OUT_PDF ($(du -h "$OUT_PDF" | cut -f1))"

echo "Done."
