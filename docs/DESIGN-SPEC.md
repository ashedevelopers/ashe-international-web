# ASHE Design Spec (Step 2 input)

Derived from a mobile screen-recording review of the reference visual language. Desktop behavior is still to be confirmed.

## Visual language
- **Mobile-first single column.** 14px page gutters, large rounded cards (about 28px radius) stacked with about 10px gaps, plus full-bleed colored bands for whole sections.
- **Color blocking.** Every section or card is one flat color: black, sky, butter yellow, clay/peach, soft green, lilac-style tint. No gradients on UI, only on photography.
- **Display type.** Ultra-heavy, condensed, uppercase, tight leading (0.9), tight tracking. Body type is a clean neutral grotesk, small and centered inside cards.
- **Stickers.** Rotated ribbon tags (-8 to +8 degrees) with 1.5px ink border and notched or wavy ends. They overlap headings and card corners ("About Us" plus a tag, "Gallery", "Common questions", "Limited spots").
- **Ornaments.** Four-point sparkle stars, a circular rotating-text badge with a down arrow (hero), a round sticker badge (footer).

## Sections (mobile order)
1. **Sticky navbar.** White, hairline bottom, wordmark left (display type), three-line menu right (lines of unequal length). Floating circular black scroll-to-top button bottom-right after the hero.
2. **Hero card.** Large tinted card: logo or photo cutout in a star shape, small uppercase eyebrow, three-line headline, location sticker bottom-left, rotating badge bottom-right.
3. **Info stack.** Four stacked cards, each with a small uppercase label and a big value: black, sky, yellow, clay. Final clay card is a call to action with an arrow.
4. **Pillar cards (3).** Cards tilted a few degrees with 2px ink border, a sparkle icon, bold title and a short line. They straighten or shift as they scroll into view.
5. **Community band.** Short centered paragraph and a black rectangular button with an accent square arrow chip.
6. **Gallery band.** Full-bleed clay section, heading with a "Gallery" sticker, rounded photo card with a small logo watermark. Photos advance as a slider.
7. **FAQ.** Centered heading with two stickers. Accordion rows are white with hairline border and a tinted square plus button. The open row turns green with a minus button.
8. **CTA banner.** Butter-yellow card, sparkles, tilted sticker, two-line headline, white pill button with a sky arrow chip.
9. **Footer.** Full-bleed soft green. Large nav links in display type (two columns), round outlined social icons, "Back to top", a giant stacked wordmark that animates in letter by letter, round sticker badge, copyright line.

## Inner-page patterns
- **Page title card.** Tinted band with the title plus overlapping stickers.
- **Numbered story cards.** 01, 02, 03: tinted card, uppercase label, image, short paragraph.
- **Stats cards.** White pill label, very large number with a trailing plus, short caption, underlined "Download" link.
- **Contact.** Uppercase field labels, outlined inputs (8px radius), black submit button with accent arrow chip, tinted contact cards, map block with sticker.

## Motion
- Cards tilt and settle on scroll-in, footer wordmark reveals on enter, rotating-text badge spins slowly, accordion height animates, buttons nudge the arrow chip on hover or press.
- All motion respects `prefers-reduced-motion`.

## ASHE adaptation (proposal)
- Palette: green `#0E622A`, yellow `#F9C61F`, ink `#0F0F0F`, plus tints derived from them: mint `#A8E6B5`, butter `#F6E27A`, soft green `#9FC0AA`, clay `#F2B88F`, sky `#B9DDF2`.
- Display font: a heavy condensed face (for example Anton); body: Inter. Playfair Display kept only for small editorial accents.
- Use real Nakivale field photography in gallery, story and hero cards; the ASHE logo replaces the wordmark.
