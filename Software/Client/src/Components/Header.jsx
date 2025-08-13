import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [cartNumber, setCartNumber] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tap2cartUser');
    const storedCartNumber = localStorage.getItem('tap2cartNumber');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedCartNumber) {
      setCartNumber(storedCartNumber);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#DEE8CE] text-white p-4 gap-4 flex justify-between items-center z-50 shadow-md shadow-[0_4px_15px_rgba(0,0,0,0.3)] ">
      <img
        src={logo}
        alt="Company Logo"
        className="h-10 w-auto object-contain md:h-12 lg:h-14"
      />

      {user ? (
        <div className="bg-white text-[#BB6653] px-2 py-1 rounded-full shadow flex gap-4 items-center">
          <span>
            {user.name} ({user.mobile})
          </span>
          {cartNumber && (
            <span className="font-semibold">Cart No.: {cartNumber}</span>
          )}
        </div>
      ) : (
        <Link
          to="/"
          className="bg-white text-[#BB6653] px-4 py-2 rounded-full shadow hover:bg-[#F08B51] hover:text-white transition">
          Register
        </Link>
      )}
    </header>
  );
};

export default Header;
