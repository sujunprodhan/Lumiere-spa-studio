'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ children, href }) => {
  const path = usePathname();
  const isActive = href === '/' ? path === href : path.startsWith(href);
  return (
    <Link
      href={href || ''}
      className={` text-base font-medium transition-colors ${isActive ? 'text-[#580F41] font-bold ' : 'hover:text-[amber-500] hover:#580F41 dark:hover:bg-slate-800'}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
