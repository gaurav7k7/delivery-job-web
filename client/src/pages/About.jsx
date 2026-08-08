import { motion } from 'framer-motion';
import { Users, MapPin } from 'lucide-react';
import { usePublicContent } from '../api/publicContent.api';
import { useSiteSettings } from '../api/settings.api';
import { Seo } from '../components/ui/Seo';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { staggerContainer, fadeUp } from '../lib/motionVariants';

function getInitials(name = '') {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

export default function About() {
  const { data: team, isLoading: teamLoading } = usePublicContent('team');
  const { data: offices, isLoading: officesLoading } = usePublicContent('offices');
  const { data: settings } = useSiteSettings();
  const reveal = useScrollReveal();

  return (
    <>
      <Seo title="About Us" description="Learn about Zerivon and the team behind India's fastest rider onboarding agency." />
      <Container className="flex flex-col gap-16 py-16">
        <motion.div {...reveal} className="flex flex-col gap-3 text-center">
          <span className="text-caption font-semibold uppercase tracking-wide text-accent-700">About Us</span>
          <h1 className="font-heading text-h1 text-neutral-900">{settings?.siteName ?? 'Zerivon'}</h1>
          <p className="mx-auto max-w-2xl text-body-lg text-neutral-600">{settings?.tagline}</p>
        </motion.div>

        <div className="flex flex-col gap-6">
          <h2 className="text-center font-heading text-h2 text-neutral-900">Our Team</h2>
          {teamLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : !team || team.length === 0 ? (
            <EmptyState icon={Users} title="Team info coming soon" headingLevel={3} />
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer(0.08)} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <motion.div key={member._id} variants={fadeUp}>
                  <Card className="flex flex-col items-center gap-3 p-6 text-center">
                    {member.photo?.url ? (
                      <OptimizedImage src={member.photo.url} alt={member.name} width={96} height={96} className="h-24 w-24 rounded-full" />
                    ) : (
                      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-500/10 text-h3 font-semibold text-primary-700">
                        {getInitials(member.name)}
                      </span>
                    )}
                    <div>
                      <p className="font-heading text-body-lg font-semibold text-neutral-900">{member.name}</p>
                      <p className="text-caption text-neutral-600">{member.designation}</p>
                    </div>
                    {member.bio && <p className="text-caption text-neutral-600">{member.bio}</p>}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {!officesLoading && offices?.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-center font-heading text-h2 text-neutral-900">Our Offices</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {offices.map((office) => (
                <Card key={office._id} className="flex flex-col gap-2 p-5">
                  <p className="flex items-center gap-2 font-heading text-body-lg font-semibold text-neutral-900">
                    <MapPin size={16} className="text-primary-500" aria-hidden="true" />
                    {office.branchName}
                  </p>
                  <p className="text-body-sm text-neutral-600">
                    {[office.addressLine, office.city, office.state, office.pincode].filter(Boolean).join(', ')}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
