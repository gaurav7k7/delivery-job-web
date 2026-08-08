import { Seo } from '../components/ui/Seo';
import { ContactSection } from '../components/home/ContactSection';

export default function Contact() {
  return (
    <>
      <Seo title="Contact Us" description="Get in touch with the Zerivon team." />
      <ContactSection />
    </>
  );
}
