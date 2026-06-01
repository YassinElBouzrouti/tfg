import { Link } from 'react-router-dom';

function Brand({ compact = false, size = 'default' }) {
  const sizeClass =
    size === 'navbar-xl'
      ? 'h-20 w-auto object-contain sm:h-24'
      : compact
        ? 'h-9 w-auto object-contain sm:h-11'
        : 'h-12 w-auto object-contain sm:h-14';

  return (
    <Link className="flex items-center gap-3 leading-tight" to="/">
      <img
        alt="Logo de Yassin's Gym"
        className={sizeClass}
        src="/images/logo/yassins-gym-logo.svg"
      />
    </Link>
  );
}

export default Brand;
