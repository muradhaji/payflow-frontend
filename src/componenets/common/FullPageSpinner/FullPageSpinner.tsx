import { IconLoader } from '@tabler/icons-react';

const FullPageSpinner = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <IconLoader className='animate-spin w-8 h-8 text-blue-600' />
    </div>
  );
};

export default FullPageSpinner;
