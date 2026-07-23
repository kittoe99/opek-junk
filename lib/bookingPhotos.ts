import { uploadBookingPhoto } from './supabase';

export interface PersistedBookingPhotos {
  photo_url: string;
  photo_urls: string[];
}

function isRemotePhotoUrl(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

function uniquePhotos(images: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const img of images) {
    const trimmed = img.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

/**
 * Upload customer photos to Supabase Storage when possible and return URLs
 * suitable for persisting in booking_details JSON.
 * Falls back to inline base64 when storage upload fails.
 */
export async function persistBookingPhotos(
  images: Array<string | null | undefined>,
  filePrefix: string
): Promise<PersistedBookingPhotos> {
  const raw = uniquePhotos(
    images.filter((img): img is string => typeof img === 'string' && img.trim() !== '')
  );
  const photo_urls: string[] = [];

  for (let i = 0; i < raw.length; i++) {
    const img = raw[i];
    if (isRemotePhotoUrl(img)) {
      photo_urls.push(img);
      continue;
    }

    if (img.startsWith('data:')) {
      const ext = img.includes('image/png')
        ? 'png'
        : img.includes('image/webp')
          ? 'webp'
          : 'jpg';
      const fileName = `${filePrefix}_${i}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploaded = await uploadBookingPhoto(img, fileName);
      photo_urls.push(uploaded ?? img);
      continue;
    }

    photo_urls.push(img);
  }

  return {
    photo_url: photo_urls[0] ?? '',
    photo_urls,
  };
}

export function withBookingPhotos<T extends Record<string, unknown>>(
  details: T,
  photos: PersistedBookingPhotos
): T & { photo_url: string; photo_urls: string[] } {
  return {
    ...details,
    photo_url: photos.photo_url,
    photo_urls: photos.photo_urls,
  };
}
