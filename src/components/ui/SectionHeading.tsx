import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  size?: 'lg' | 'md';
  align?: 'left' | 'center';
  className?: string;
  as?: 'h2' | 'h3';
}

export function SectionHeading({ id, eyebrow, title, lede, size = 'lg', align = 'left', className, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className={cx(align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className={cx('eyebrow', align === 'center' && 'eyebrow--plain')} data-reveal="up">
          {eyebrow}
        </p>
      )}
      <Tag id={id} className={cx(size === 'lg' ? 'display-lg' : 'display-md', eyebrow && 'mt-6')} data-reveal="up" data-reveal-delay="0.05">
        {title}
      </Tag>
      {lede && (
        <p className={cx('lede mt-6 max-w-[40rem]', align === 'center' && 'mx-auto')} data-reveal="up" data-reveal-delay="0.12">
          {lede}
        </p>
      )}
    </div>
  );
}
