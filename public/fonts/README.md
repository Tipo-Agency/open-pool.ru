# Open Pool Ruble

`open-pool-ruble-wght-v1.woff2` contains only U+20BD (₽), derived from the site's existing Unbounded variable font.

- Original: Unbounded 1.701, Google Fonts Latin Extended WOFF2, `unbounded-936fcc0c.woff2`.
- Source URL: https://open-pool.ru/_next/static/_vinext_fonts/unbounded-4c246c4715de/unbounded-936fcc0c.woff2
- Original SHA-256: `ed84482df7b95e6a56a113de1ba2a8d54337f499ba19d54ca697a7e15427ff5f`.
- Subset SHA-256: `aaa99606c3025e1eb63debc22f3dd5dffc61c5d7778c73db166fcc9359785874`.
- Copyright 2022 The Unbounded Project Authors (https://github.com/googlefonts/unbounded).
- License: SIL Open Font License 1.1, preserved in `OFL-Unbounded.txt`.
- License source: https://raw.githubusercontent.com/google/fonts/main/ofl/unbounded/OFL.txt
- Modified on 2026-10-18 with fontTools 4.60.2 and Brotli. Family/PostScript names changed to Open Pool Ruble/OpenPoolRuble.
- Original file: 117,648 bytes; subset: 1,052 bytes; saving: 116,596 bytes per replaced font transfer, excluding HTTP headers.
- Variable axis preserved: wght 200–900, default 400.

Validation with fontTools: cmap equals {U+20BD}, fvar matches source; instantiated outlines and horizontal advances exactly match the original at weights 200, 400, 700, 900.

The subset is the first family in `--font-unbounded` with `unicode-range: U+20BD`; all other characters keep the existing Unbounded faces and fallbacks. No original extended font file is removed. Other extended characters can still load the full Latin Extended file. This change saves font bytes; it does not establish a measured LCP improvement.

Headless Chrome font-only verification passed: a local HTML page rendering ₽ requested the 1,052-byte subset and did not request the original extended font. Adding ₺ (U+20BA) then requested the original extended font, confirming that other extended glyphs retain their fallback. This isolated check does not replace the parent task’s final rendered-page verification.
