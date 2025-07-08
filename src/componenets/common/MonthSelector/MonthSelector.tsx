import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';

interface MonthSelectorProps {
  selectedMonth: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const MonthSelector = ({
  selectedMonth,
  onChange,
  disabled = false,
}: MonthSelectorProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const newMenuHeight = windowHeight - rect.y - 10;
      if (newMenuHeight < rect.height) {
        menuRef.current.style.setProperty('height', `${newMenuHeight}px`);
      }
    }
  }, [open]);

  const handleSelect = (monthKey: number) => {
    onChange(monthKey);
    setOpen(false);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      <button
        type='button'
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`bg-gray-600 text-white px-3 py-1 rounded-xl hover:bg-gray-500 transition flex items-center gap-2 justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {capitalize(dayjs().month(selectedMonth).format('MMMM'))}
        <ChevronDown className='h-4 w-4' />
      </button>

      {open && (
        <ul
          ref={menuRef}
          className='absolute mt-1 bg-white rounded-xl shadow-lg z-10 overflow-auto max-h-50'
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <li
              key={index}
              onClick={() => handleSelect(index)}
              className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700'
            >
              {capitalize(dayjs().month(index).format('MMMM'))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MonthSelector;
