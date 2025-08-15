import React from 'react';

const PaymentSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          🎉 Payment Successful!
        </h2>
        <p className="text-gray-700 mb-6">
          Thank you for shopping, Cart is ready for you.
        </p>
        <button
          onClick={onClose}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600 transition">
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
