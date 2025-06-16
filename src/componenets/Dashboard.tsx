import Header from './Header';
import LogOutButton from './LogOutButton';

function Dashboard() {
  return (
    <div className='min-h-[100dvh] flex flex-col bg-gray-200'>
      <Header rightElement={<LogOutButton />} />
      <div className='px-3 py-12'>
        <div className='container mx-auto'>
          <h1>Dashboard</h1>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
