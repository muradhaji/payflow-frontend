import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({
  title,
  amount,
  icon,
  routeUrl,
  color,
}: {
  title: string;
  amount: number;
  icon: React.ReactNode;
  routeUrl: string;
  color: string;
}) => {
  return (
    <Link
      to={routeUrl}
      className={`cursor-pointer rounded-2xl shadow-md bg-white hover:shadow-lg transition-all p-5 border-t-4 ${color}`}
    >
      <div className='flex items-center gap-4'>
        <div className='p-2 bg-gray-100 rounded-full'>{icon}</div>
        <div>
          <h3 className='text-lg font-semibold text-gray-700'>{title}</h3>
          <p className='text-2xl font-bold text-gray-900'>{amount} ₼</p>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCard;
