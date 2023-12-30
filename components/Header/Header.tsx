import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@/lib/utils';

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => (
  <header
    className={cn('flex justify-between p-4', {
      [className as string]: !!className,
    })}
  >
    <h1>Afro Hair and Beauty.</h1>
    <section className="flex gap-x-4">
      <FontAwesomeIcon
        icon={['far', 'user']}
        color="var(--color-black)"
        size="xl"
      />
      <FontAwesomeIcon
        icon={['far', 'heart']}
        color="var(--color-black)"
        size="xl"
      />
      <FontAwesomeIcon
        icon={['far', 'shopping-bag']}
        color="var(--color-black)"
        size="xl"
      />
    </section>
  </header>
);

export default Header;
