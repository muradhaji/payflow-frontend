import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

interface HeaderProps {
  rightElement?: ReactNode;
}

function Header({ rightElement }: HeaderProps) {
  return (
    <header className='bg-gray-100 p-3 shadow-xl'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link to='/' className='text_logo text-2xl font-bold pointer'>
          <span className='text-blue-600'>Pay</span>
          <span>Flow</span>
        </Link>
        <div className='flex gap-2'>
          <LanguageSwitcher />
          {rightElement}
        </div>
      </div>
    </header>
  );
}

export default Header;
