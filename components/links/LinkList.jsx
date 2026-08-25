import LinkButton from './LinkButton';

/**
 * LinkList renders the full list of active links on the public profile page.
 */
export default function LinkList({ links = [], buttonStyle = 'rounded', username }) {
  const activeLinks = links.filter((l) => l.is_active);

  if (activeLinks.length === 0) {
    return (
      <p className="text-center text-white/30 text-sm py-8">
        No links added yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full px-4">
      {activeLinks.map((link) => (
        <LinkButton
          key={link.id}
          link={link}
          buttonStyle={buttonStyle}
          username={username}
          preview={false}
        />
      ))}
    </div>
  );
}
