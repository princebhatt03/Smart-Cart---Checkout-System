import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';

const MallPage = () => {
  const { mallName } = useParams();
  const navigate = useNavigate();

  // Convert slug to readable text
  const displayName = mallName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Dummy product data
  const products = {
    Girls: [
      {
        id: 1,
        name: 'Floral Dress',
        price: 1200,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 2,
        name: 'Pink Top',
        price: 800,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 3,
        name: 'Denim Skirt',
        price: 950,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 4,
        name: 'Summer Hat',
        price: 500,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
    ],
    Boys: [
      {
        id: 5,
        name: 'Casual Shirt',
        price: 1100,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 6,
        name: 'Jeans',
        price: 1400,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 7,
        name: 'Hoodie',
        price: 1600,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 8,
        name: 'Sports Cap',
        price: 400,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
    ],
    Groceries: [
      {
        id: 9,
        name: 'Rice 5kg',
        price: 500,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 10,
        name: 'Milk 1L',
        price: 60,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 11,
        name: 'Bread',
        price: 40,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
      {
        id: 12,
        name: 'Bread',
        price: 40,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s',
      },
    ],
  };

  const [cart, setCart] = useState([]);

  const addToCart = product => {
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = productId => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FFF8E8] pt-24">
        {/* Mall Welcome Section */}
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#BB6653]">
            Welcome to {displayName} Mall
          </h1>
          <p className="mt-4 text-lg text-[#F08B51]">
            Enjoy your shopping experience at {displayName} Mall.
          </p>
        </div>

        {/* Shopping Categories */}
        <div className="w-full mt-10 space-y-12 px-6 pb-24">
          {Object.keys(products).map(category => (
            <div key={category}>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#BB6653] mb-6">
                {category}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products[category].map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-32 h-32 object-cover mb-4 rounded"
                    />
                    <h3 className="text-lg font-semibold text-[#BB6653]">
                      {product.name}
                    </h3>
                    <p className="text-[#F08B51] font-medium mt-2">
                      ₹{product.price}
                    </p>

                    {cart.find(item => item.id === product.id) ? (
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition">
                        Remove from Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
                        Add to Cart
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Shopping Completed Button */}
        <div className="sticky bottom-0 w-full p-3 bg-[#DEE8CE] py-4 flex justify-between items-center shadow-inner">
          <button
            className="px-6 py-3 bg-[#BB6653] text-white rounded-lg shadow hover:bg-[#a65847] transition"
            onClick={() => alert('Shopping Completed!')}>
            Shopping Completed
          </button>
          <button
            className="px-6 py-3 bg-[#a65c4d] text-white rounded-lg shadow hover:bg-[#a65847] transition"
            onClick={() => navigate('/Front-Page')}>
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default MallPage;
