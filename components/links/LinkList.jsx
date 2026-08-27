'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LinkButton from './LinkButton';

/**
 * AnimatedLinkCard: Adds iOS-style soft settling scale/opacity scroll dynamics
 * as the link card enters/nears the viewport boundaries.
 */
function AnimatedLinkCard({ link, buttonStyle, font, username }) {
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.12, 0.9, 1], [0.94, 1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.95, 1], [0.75, 1, 1, 0.85]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity }}
      className="w-full origin-bottom"
    >
      <LinkButton
        link={link}
        buttonStyle={buttonStyle}
        font={font}
        username={username}
        preview={false}
      />
    </motion.div>
  );
}

/**
 * LinkList renders the list of active links on the public profile page.
 * When buttonStyle === 'bentogrid', it automatically formats into a responsive 2-column grid.
 */
export default function LinkList({ links = [], buttonStyle = 'rounded', font, username }) {
  const activeLinks = links.filter((l) => l.is_active);

  if (activeLinks.length === 0) {
    return (
      <p className="text-center text-slate-400 text-sm py-8">
        No links added yet.
      </p>
    );
  }

  const isBento = buttonStyle === 'bentogrid';

  return (
    <div className={isBento ? 'grid grid-cols-2 gap-3 w-full px-4' : 'flex flex-col gap-3 w-full px-4'}>
      {activeLinks.map((link) => (
        <AnimatedLinkCard
          key={link.id}
          link={link}
          buttonStyle={buttonStyle}
          font={font}
          username={username}
        />
      ))}
    </div>
  );
}
