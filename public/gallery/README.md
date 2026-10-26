Исходные фото галереи (JPG/PNG). После добавления файла:
1. Добавьте запись в app/gallery-data.ts: src "/gallery/<файл>", alt и подпись.
2. Запустите node scripts/optimize-gallery-photos.mjs — он создаст WebP в public/photos и обновит app/gallery-photos.json.
