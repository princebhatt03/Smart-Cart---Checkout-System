import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MallPage = () => {
  const { mallName } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem('tap2cartUser'));
  const userId = storedUser?._id;

  const displayName = mallName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Fetch products
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL || 'http://localhost:3000'
        }/api/products`
      )
      .then(res => setProducts(res.data))
      .catch(err => toast.error('Failed to load products'));
  }, [mallName]);

  // Fetch user cart
  useEffect(() => {
    if (userId) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL || 'http://localhost:3000'
          }/api/cart/${userId}`
        )
        .then(res => {
          if (res.data?.products) {
            setCart(res.data.products);
            setCount(
              res.data.products.reduce((sum, item) => sum + item.quantity, 0)
            );
          }
        })
        .catch(err => toast.error('Failed to fetch cart'));
    }
  }, [userId, setCart]);

  // Add product to cart
  const handleAddToCart = async product => {
    if (!userId) {
      toast.warn('Please register/login first');
      return;
    }

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_URL || 'http://localhost:3000'
        }/api/cart/add`,
        { userId, productId: product._id, quantity: 1 }
      );

      if (res.data?.products) {
        setCart(res.data.products);
        setCount(
          res.data.products.reduce((sum, item) => sum + item.quantity, 0)
        );
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding product to cart');
    }
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FFF8E8] pt-24">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#BB6653]">
            Welcome to {displayName} Mall
          </h1>
          <p className="mt-2 text-lg text-[#F08B51]">
            Enjoy your shopping experience at {displayName} Mall.
          </p>
        </div>

        {/* Products */}
        <div className="w-full mt-10 space-y-12 px-6 pb-24">
          {Object.keys(groupedProducts).map(category => (
            <div key={category}>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#BB6653] mb-6">
                {category}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {groupedProducts[category].map(product => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL || 'http://localhost:3000'
                      }${product.image}`}
                      alt={product.name}
                      className="w-32 h-32 object-cover mb-4 rounded"
                    />
                    <h3 className="text-lg font-semibold text-[#BB6653]">
                      {product.name}
                    </h3>
                    <p className="text-[#F08B51] font-medium mt-2">
                      ₹{product.price}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 w-full p-3 bg-[#DEE8CE] py-4 flex justify-between items-center shadow-inner">
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-3 bg-[#BB6653] text-white p-4 rounded-full shadow-lg hover:bg-[#a65847] transition relative z-50">
            <FaShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {count}
              </span>
            )}
          </button>
          <button
            className="px-4 py-3 bg-[#a65c4d] text-white rounded-lg shadow hover:bg-[#a65847] transition"
            onClick={() => navigate('/Front-Page')}>
            Back to Home
          </button>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
        />
      </div>
    </>
  );
};

export default MallPage;
