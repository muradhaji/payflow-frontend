import { Link } from 'react-router-dom';
import Header from './Header';

export default function Home() {
  return (
    <section className='home_page min-h-[100dvh] bg-gray-200 flex flex-col'>
      <Header
        rightElement={
          <Link
            to='/login'
            className='rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            Log in
          </Link>
        }
      />
      <main id='parent' className='px-3 py-12 sm:px-0 flex-1 flex'>
        <div id='child' className='container mx-auto max-w-2xl'>
          <div className='flex flex-col gap-6 justify-center h-full'>
            <h1 className='text-center text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl'>
              Track Your Payments, <br />
              Stay on Top of Your Budget
            </h1>
            <p className=' text-center text-md font-medium text-pretty text-gray-500 sm:text-lg/6'>
              PayFlow is a simple and efficient platform for tracking your
              personal payments. <br /> Easily record your monthly obligations,
              monitor how much you've paid so far, and keep an eye on your
              remaining balances.
            </p>
            <div className='flex gap-2 items-center justify-center'>
              <Link
                to='/register'
                className='rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
              >
                Get started
              </Link>
              <Link
                to='https://muradhajiyev.vercel.app/projects'
                className='text-sm/6 font-semibold text-gray-900'
              >
                View other projects <span aria-hidden='true'>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className='px-3 py-4 sm:px-0 bg-gray-100'>
        <div className='container mx-auto'>
          <p className='text-sm text-gray-700 text-center sm:text-md sm:text-left'>
            © 2025 | Murad Hajiyev
          </p>
        </div>
      </footer>
    </section>
  );
}
