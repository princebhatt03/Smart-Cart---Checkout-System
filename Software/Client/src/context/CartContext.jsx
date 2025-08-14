import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem('tap2cartUser'));
  const userId = storedUser?._id;

  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Fetch user cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${VITE_API_URL}/api/cart/${userId}`);
        // Always populate products for immediate display
        const populatedProducts = res.data.products.map(p => ({
          ...p.productId, // spread populated product info
          quantity: p.quantity,
          _id: p.productId._id,
        }));
        setCart(populatedProducts);
      } catch (err) {
        toast.error('Failed to fetch cart');
      }
    };
    fetchCart();
  }, [userId]);

  // Add product to cart
  const addToCart = async productId => {
    if (!userId) {
      toast.warn('Please register/login first');
      return;
    }

    try {
      const res = await axios.post(`${VITE_API_URL}/api/cart/add`, {
        userId,
        productId,
        quantity: 1,
      });

      if (res.data?.products) {
        const populatedProducts = res.data.products.map(p => ({
          ...p.productId,
          quantity: p.quantity,
          _id: p.productId._id,
        }));
        setCart(populatedProducts);
        toast.success('Product added to cart');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add product');
    }
  };

  // Remove product from cart
  const removeFromCart = async productId => {
    if (!userId) return;

    try {
      const res = await axios.post(`${VITE_API_URL}/api/cart/remove`, {
        userId,
        productId,
      });

      if (res.data?.products) {
        const populatedProducts = res.data.products.map(p => ({
          ...p.productId,
          quantity: p.quantity,
          _id: p.productId._id,
        }));
        setCart(populatedProducts);
        // toast.info('Product removed from cart');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove product');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!userId) return;

    try {
      const res = await axios.post(`${VITE_API_URL}/api/cart/clear`, {
        userId,
      });
      setCart([]);
      toast.info('Cart cleared');
    } catch (err) {
      console.error('Cart clear error:', err.response?.data || err.message);

      // If cart not found, just clear frontend cart
      setCart([]);
      toast.info('Cart cleared');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
