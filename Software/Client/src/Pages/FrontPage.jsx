import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const malls = [
  {
    name: 'Vishal Mart',
    img: 'https://investorzone.in/wp-content/uploads//Picture-300x83.png',
  },
  {
    name: 'D-Mart',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtvBNda0Stvlwo3-qqZgGFlJURrlWR6mNpvg&s',
  },
  {
    name: 'V-Mart',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6oL3kAu2xArcPDGbk2dJvB3OA-Y2J2vrbQ&s',
  },
  {
    name: 'Reliance Mart',
    img: 'https://content3.jdmagicbox.com/comp/jamnagar/w6/0288px288.x288.101123125022.d2w6/catalogue/reliance-super-mart-jamnagar-ho-jamnagar-supermarkets-wgtg8cs5dg.jpg',
  },
  {
    name: 'Big Bazaar',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkLERR0Qa2jRA2MFhCgi8QeBL2RX8vwJkOFw&s',
  },
  {
    name: 'Jio Mart',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeGpNCx4wyj3pt3b2zM_QHyvXo6hnDYFv8nw&s',
  },
];

const FrontPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('tap2cartUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSelectMall = mallName => {
    navigate(`/mall/${mallName.replace(/\s+/g, '-').toLowerCase()}`);
  };

  const handleLeave = async () => {
    if (!user?._id) {
      toast.error('No user found.');
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/${
          user._id
        }`,
        { withCredentials: true }
      );

      localStorage.removeItem('tap2cartUser');
      toast.success('Cart deactivated successfully. See you next time!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to deactivate cart.');
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen top-5 relative flex flex-col items-center"
        style={{ backgroundColor: '#FFF8E8' }}>
        {/* Hero Section */}
        <section
          className="w-full py-16 px-6 text-center"
          style={{
            background: `linear-gradient(to right, #BB6653, #F08B51)`,
            color: '#FFF8E8',
          }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
            <FaShoppingCart className="inline-block mr-3" />
            Welcome to Tap2Cart
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Shop faster, smarter, and skip the checkout lines! Select your mall
            to start shopping instantly.
          </p>

          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition">
              Didn't Buy Anything — Leave
            </button>
          )}
        </section>

        {/* Mall Selection */}
        <section className="container mx-auto py-12 px-6">
          <h2
            className="text-2xl md:text-3xl font-semibold text-center mb-8"
            style={{ color: '#BB6653' }}>
            Select Your Mall
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {malls.map(mall => (
              <div
                key={mall.name}
                onClick={() => handleSelectMall(mall.name)}
                className="rounded-xl p-6 flex flex-col items-center cursor-pointer transform hover:scale-105 transition duration-300"
                style={{
                  backgroundColor: '#DEE8CE',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}>
                <img
                  src={mall.img}
                  alt={mall.name}
                  className="w-32 h-32 object-contain mb-4"
                />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: '#BB6653' }}>
                  {mall.name}
                </h3>
                <p
                  className="text-sm mt-2"
                  style={{ color: '#F08B51' }}>
                  Click to Start Shopping
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
              <h2 className="text-xl font-semibold text-[#BB6653]">
                Are you sure?
              </h2>
              <p className="mt-2 text-gray-700">
                You didn’t buy anything. Do you want to leave?
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleLeave}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Yes, Leave
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FrontPage;
