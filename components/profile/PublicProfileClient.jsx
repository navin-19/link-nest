'use client';

import LinkBioRenderer from '@/components/profile/LinkBioRenderer';

/**
 * PublicProfileClient renders the public Link-in-Bio profile page
 * using the shared LinkBioRenderer component.
 */
export default function PublicProfileClient({ profile, links = [], products = [], username }) {
  return (
    <LinkBioRenderer
      profile={profile}
      links={links}
      products={products}
      theme={profile?.themes}
      preview={false}
      compact={false}
      username={username}
    />
  );
}
