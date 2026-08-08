import { Share2 } from 'lucide-react';
import { siFacebook, siInstagram, siX, siYoutube, siWhatsapp, siTiktok, siPinterest } from 'simple-icons';

// lucide-react (v1) dropped trademarked brand-logo icons — simple-icons is
// the standard package for these instead. Note: simple-icons does not ship
// a LinkedIn mark (removed from the package), so that platform falls back
// to the generic Share2 icon below.
const BRAND_ICONS = {
  facebook: siFacebook,
  instagram: siInstagram,
  twitter: siX, // Twitter rebranded to X; platform key kept as "twitter" for schema/back-compat
  youtube: siYoutube,
  whatsapp: siWhatsapp,
  tiktok: siTiktok,
  pinterest: siPinterest,
};

export function SocialIcon({ platform, size = 16 }) {
  const icon = BRAND_ICONS[platform];

  if (!icon) return <Share2 size={size} aria-hidden="true" />;

  return (
    <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
