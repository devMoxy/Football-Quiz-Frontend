/**
 * Rewrites Wikimedia Commons image URLs to request a properly sized thumbnail
 * instead of the (often multi-MB) full-resolution original. Non-Wikimedia
 * URLs (e.g. TheSportsDB) are returned unchanged.
 */

/**
 * Wikimedia's thumbnail backend only serves a fixed set of widths to direct
 * (hotlinked) requests like ours — anything else 400s. Requested widths are
 * snapped up to the nearest one of these. See $wgThumbnailSteps:
 * https://www.mediawiki.org/wiki/Special:MyLanguage/Common_thumbnail_sizes
 */
const STANDARD_THUMBNAIL_WIDTHS = [20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840] as const

/** Pixel widths to request for each place an image renders in the app (pre-snapped to standard sizes). */
export const WIKIMEDIA_IMAGE_WIDTH = {
  /** Landing page mode-select hero cards (~220px display, 2x for retina). */
  HERO: 500,
  /** Achievement grid boxes (mode 3). */
  GRID_THUMBNAIL: 250,
  /** Career path club crest, full size (question screen, ~52px display, 2x). */
  CREST: 120,
  /** Career path club crest, compact size (results recap list, ~30px display, 2x). */
  CREST_COMPACT: 60,
  /** Active player avatar (mode 3, ~56px display, 2x). */
  AVATAR: 120,
} as const

function isWikimediaUpload(hostname: string): boolean {
  return hostname === 'upload.wikimedia.org'
}

function snapToStandardWidth(width: number): number {
  for (const step of STANDARD_THUMBNAIL_WIDTHS) {
    if (width <= step) return step
  }
  return STANDARD_THUMBNAIL_WIDTHS[STANDARD_THUMBNAIL_WIDTHS.length - 1]
}

/**
 * Given any image URL, returns a Wikimedia thumbnail URL sized to `width`
 * (snapped up to the nearest size Wikimedia's thumbnail backend actually
 * serves) when the URL points at upload.wikimedia.org. Any other URL
 * (including TheSportsDB URLs) is returned untouched.
 */
export function getWikimediaThumbnailUrl(url: string, width: number): string {
  if (!url || !Number.isFinite(width) || width <= 0) return url

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }

  if (!isWikimediaUpload(parsed.hostname)) return url

  const segments = parsed.pathname.split('/').filter(Boolean)
  if (segments.length < 3) return url

  const snappedWidth = snapToStandardWidth(width)
  const thumbIndex = segments.indexOf('thumb')

  if (thumbIndex !== -1) {
    // Already a thumbnail URL:
    // /wikipedia/commons/thumb/a/bb/Filename.ext/500px-Filename.ext
    const sizedSegment = segments[segments.length - 1]
    const filename = sizedSegment.replace(/^\d+px-/, '')
    segments[segments.length - 1] = `${snappedWidth}px-${filename}`
  } else {
    // Full-resolution original:
    // /wikipedia/commons/a/bb/Filename.ext
    const filename = segments[segments.length - 1]
    segments.splice(2, 0, 'thumb')
    segments.push(`${snappedWidth}px-${filename}`)
  }

  parsed.pathname = `/${segments.join('/')}`
  return parsed.toString()
}
