import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart } from '@fortawesome/pro-regular-svg-icons';
import { cn } from '@/lib/utils';
import Bag from '@/components/Bag/Bag';

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => (
  <header
    className={cn('flex justify-between p-4', {
      [className as string]: !!className,
    })}
  >
    <Link href="/">Afro Hair and Beauty</Link>
    <section className="flex gap-x-4">
      <FontAwesomeIcon icon={faUser} size="xl" className="text-black" />
      <FontAwesomeIcon icon={faHeart} size="xl" className="text-black" />
      <Link href="/bag">
        <Bag />
      </Link>
    </section>
  </header>
);

export default Header;
