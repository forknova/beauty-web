import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart } from '@fortawesome/pro-regular-svg-icons';
import cn from '@/utils/cn';
import Bag from '@/components/Bag/Bag';
import AuthButton from '../buttons/AuthButton/AuthButton';

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn('flex items-center justify-between p-4', {
        [className as string]: !!className,
      })}
    >
      <Link href="/">Afro Hair and Beauty</Link>
      <section className="flex items-center gap-x-4">
        <FontAwesomeIcon icon={faUser} size="xl" className="text-black" />
        <FontAwesomeIcon icon={faHeart} size="xl" className="text-black" />
        <Link href="/bag">
          <Bag />
        </Link>
        <AuthButton />
      </section>
    </header>
  );
};

export default Header;
