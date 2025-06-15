import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className='rounded-md bg-transparent p-2 font-medium text-gray-800 shadow-xs border border-gray-300 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 cursor-pointer'
    >
      <option value='en'>En</option>
      <option value='az'>Az</option>
    </select>
  );
};

export default LanguageSwitcher;
