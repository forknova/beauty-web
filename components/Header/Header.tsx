type HeaderProps = {
  className?: string;
};


const Header = ({
  className
}: HeaderProps) => (
    <header className={className}>
      <h1>Afro Hair and Beauty.</h1>
    </header>
);

export default Header