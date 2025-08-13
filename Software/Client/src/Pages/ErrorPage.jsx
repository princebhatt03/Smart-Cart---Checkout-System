import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8E8] px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-[#BB6653] mb-4 animate-pulse">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-[#F08B51] mb-6">
          Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
          Oops! The page you are looking for does not exist or has been moved.
          You can go back to the homepage or Front-Page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/Front-Page')}
            className="px-6 py-3 bg-[#C77463] text-white rounded-lg shadow hover:bg-[#a65c4d] transition">
            Go to Front-Page
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#BB6653] text-white rounded-lg shadow hover:bg-[#a65847] transition">
            Go to Register Page
          </button>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
