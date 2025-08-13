import React, { useEffect, useState } from 'react';
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
    <header className="bg-[#BB6653] text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Tap2Cart</h1>

      {user ? (
        <div className="bg-white text-[#BB6653] px-4 py-2 rounded-full shadow flex gap-4 items-center">
          <span>
            {user.name} ({user.mobile})
          </span>
          {cartNumber && (
            <span className="font-semibold">Cart Number: {cartNumber}</span>
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
