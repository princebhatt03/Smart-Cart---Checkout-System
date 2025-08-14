import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate total price safely
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.productId?.price || item.price) * item.quantity,
    0
  );

  // Remove product from cart
  const handleRemove = async productId => {
    try {
      await removeFromCart(productId);
      toast.success('Product removed from cart');
    } catch (err) {
      toast.error('Failed to remove product');
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.info('Cart cleared successfully');
    } catch (err) {
      toast.error('Failed to clear cart');
    }
  };

  // Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warn('Cart is empty!');
      return;
    }
    // Navigate to checkout page and pass cart items
    navigate('/checkout', {
      state: {
        cartItems: cart,
        userName: JSON.parse(localStorage.getItem('tap2cartUser'))?.name,
        userEmail: JSON.parse(localStorage.getItem('tap2cartUser'))?.email,
      },
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FFF8E8] pt-24 px-6 pb-12">
        <h1 className="text-3xl font-bold text-[#BB6653] mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-lg text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, index) => {
                const product = item.productId || item; // support populated & unpopulated
                const imageUrl = product.image;

                return (
                  <div
                    key={`${product._id}-${index}`}
                    className="bg-white shadow p-4 rounded flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL ||
                          'http://localhost:3000'
                        }${imageUrl}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h2 className="text-lg font-semibold">
                          {product.name}
                        </h2>
                        <p>
                          ₹{product.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-3">
              <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-[#BB6653] text-white rounded hover:bg-[#a65847] transition">
          Back
        </button>

        <ToastContainer
          position="top-right"
          autoClose={2000}
        />
      </div>
    </>
  );
};

export default CartPage;
