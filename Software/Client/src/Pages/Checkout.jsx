import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Header from '../Components/Header';
import PaymentSuccessModal from '../Components/PaymentSuccessModal';

const BACKEND_URL = import.meta.env.VITE_API_URL;

function loadScript(src) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.productId?.price || item.price) * item.quantity,
    0
  );

  const handlePayment = async e => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.warn('Cart is empty!');
      return;
    }

    setIsProcessing(true);
    const loaded = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );
    if (!loaded) {
      toast.error('Failed to load Razorpay SDK.');
      setIsProcessing(false);
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('tap2cartUser'));
      if (!storedUser) {
        toast.error('Please login to proceed.');
        setIsProcessing(false);
        return;
      }

      const userId = storedUser._id;

      // 1️⃣ Create order on backend
      const orderRes = await axios.post(
        `${BACKEND_URL}/api/payment/create-order`,
        {
          amount: Math.round(subtotal * 100),
        }
      );
      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Tap2Cart',
        description: 'Shopping Payment',
        order_id: order.id,
        handler: async response => {
          try {
            await axios.post(`${BACKEND_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              userId,
            });

            await clearCart();
            localStorage.removeItem('tap2cartUser');
            setShowSuccessModal(true);
          } catch (err) {
            console.error(err);
            toast.error(
              err.response?.data?.message || 'Payment verification failed.'
            );
          }
        },
        prefill: {
          name: storedUser.name || 'Tap2Cart User',
          email: storedUser.email || 'user@example.com',
        },
        theme: { color: '#FF708E' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('Error initiating payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
      />
      <Header />
      <main className="px-4 py-8 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">No items to checkout.</p>
        ) : (
          <div className="md:flex gap-8">
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-xl font-semibold">Your Items</h3>
              {cart.map((item, index) => {
                const product = item.productId || item;
                return (
                  <div
                    key={`${product._id}-${index}`}
                    className="flex gap-4 items-center border-b pb-4">
                    <img
                      src={`${BACKEND_URL}${product.image}`}
                      alt={product.name}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: ₹{(item.quantity * product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="text-right font-bold text-lg">
                Subtotal: ₹{subtotal.toFixed(2)}
              </div>
            </div>
            <form
              onSubmit={handlePayment}
              className="md:w-1/2 bg-white p-6 shadow rounded space-y-4">
              <h3 className="text-xl font-semibold">Payment</h3>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2 bg-pink-500 text-white font-semibold rounded disabled:opacity-50">
                {isProcessing ? 'Processing...' : `Pay ₹${subtotal.toFixed(2)}`}
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default CheckoutPage;
