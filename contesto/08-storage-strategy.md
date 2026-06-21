# 08 — Storage Strategy

> **Document status:** Official reference for Claude Code.
> **Project:** ADG Merengue Vault
> **Platform:** Supabase Storage
> **Last updated:** 2026-06-20

How card and reference images are stored, named, served, and secured.

---

## 1. Buckets

| Bucket | Public? | Purpose |
|--------|---------|---------|
| `cards` | **Public read** | All card images (front, back, gallery) |
| `wishlist` | **Public read** | Reference images for wanted cards |

> Public read is appropriate: these are showcase images meant to be seen. Writes are admin-only via Storage RLS.

### Folder structure (within `cards`)
```
cards/
  front/     <card_id>.<ext>          or  <card_id>_front.<ext>
  back/      <card_id>_back.<ext>
  gallery/   <card_id>/<n>.<ext>      (multiple per card)
```
```
wishlist/
  reference/ <wishlist_id>.<ext>
```

---

## 2. Naming convention

- Use the card's **UUID** as the stem to guarantee uniqueness and easy cleanup:
  - Front: `front/<card_id>.webp`
  - Back: `back/<card_id>.webp`
  - Gallery: `gallery/<card_id>/<index>.webp` (e.g. `gallery/<id>/1.webp`)
- If a card is created before images are uploaded, generate a client-side UUID first, or upload to a temp path and rename on save.
- Never trust the original filename; always re-key by UUID + sanitized extension.

---

## 3. Image format & optimization

- **Preferred upload format:** WebP (or AVIF) for size; accept JPEG/PNG/HEIC and convert.
- **Max source size:** reject > 15 MB; recommend ≤ 5 MB.
- **Variants:** generate at least two renditions where possible:
  - `thumb` (~400px wide) for grid/collection.
  - `full` (~1200–1600px) for detail/lightbox.
  - Store variants as `gallery/<id>/1_thumb.webp` etc., **or** rely on Next.js `<Image>` + a loader/transform.
- **Supabase image transformations:** use the render endpoint `.../object/public/cards/...?width=400&quality=75` for on-the-fly resizing if enabled, avoiding manual variant management.
- **Aspect ratio:** card images ≈ 5:7; do not crop slabs — letterbox on near-black if needed.
- **Watermark:** optional discreet "ADG / MERENGUE VAULT" applied at upload time (config). Keep it subtle and off the card's center.

---

## 4. Serving images

- Public URL pattern: `https://<project>.supabase.co/storage/v1/object/public/cards/front/<card_id>.webp`
- Store the **full public URL** in `cards.front_image_url`, `back_image_url`, and each entry of `gallery_images[]` (doc 04/05).
- Use Next.js `<Image>` with `remotePatterns` allow-listing the Supabase domain in `next.config.js`.
- Set long cache headers (immutable) since filenames are content-stable per card; bust by changing the path on re-upload.

---

## 5. Upload flow (admin)

```
Admin selects image in /admin/cards/new (or /admin/uploads)
  → (optional) client compresses/converts to WebP
  → upload to Supabase Storage at deterministic path (uses card UUID)
  → receive public URL
  → set front_image_url / back_image_url / append to gallery_images
  → save card (doc 07 §4)
```

Preferred: **direct-to-Supabase** upload from the authenticated admin client (fast, no server relay). Server-mediated `/api/uploads` (doc 07 §7) is the fallback.

---

## 6. Deletion & cleanup

- Deleting a card (`DELETE /api/cards/[id]`) must also remove:
  - `front/<id>.*`, `back/<id>.*`, and the whole `gallery/<id>/` folder.
- Replacing an image: upload to the same path (overwrite) or delete old + upload new and update the URL.
- Provide an "orphan finder" in `/admin/uploads` (optional): list storage objects with no matching card row.

---

## 7. Storage RLS / security

```sql
-- Public read on both buckets
create policy "public read cards"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'cards');

create policy "public read wishlist"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'wishlist');

-- Admin-only writes
create policy "admin write cards"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cards' and public.is_admin());

create policy "admin update cards"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cards' and public.is_admin());

create policy "admin delete cards"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cards' and public.is_admin());

-- (repeat insert/update/delete policies for bucket 'wishlist')
```

---

## 8. Privacy note

Images are public by design. **No financial data is ever embedded** in image metadata or filenames. Cost basis lives only in DB columns excluded from the public view (doc 04 §8). If the owner wants certain images hidden until a card is published, gate via a `published` flag on the card (future enhancement) rather than bucket privacy.

---

## 9. Environment / config

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (storage base) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client reads (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only (never client) for privileged ops |
| `NEXT_PUBLIC_STORAGE_BUCKET_CARDS` | `cards` |
| `NEXT_PUBLIC_STORAGE_BUCKET_WISHLIST` | `wishlist` |

`next.config.js` → `images.remotePatterns` must include `https://<project>.supabase.co/storage/v1/object/public/**`.
