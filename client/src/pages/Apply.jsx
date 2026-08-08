import { Seo } from '../components/ui/Seo';
import { RiderApplySection } from '../components/home/RiderApplySection';

// A standalone route to the same rider-application form embedded on the
// homepage's "cta" section — needed as a real link target for pages other
// than Home (a same-page "#apply" anchor doesn't work cross-page in an SPA:
// the target element doesn't exist in the DOM until after the new page's
// lazy chunk has rendered, which is after the browser's native hash-scroll
// already ran).
export default function Apply() {
  return (
    <>
      <Seo title="Become a Rider" description="Apply to become a delivery rider with Zerivon — fast onboarding, weekly payouts, free training." />
      <RiderApplySection />
    </>
  );
}
