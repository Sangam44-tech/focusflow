// frontend/src/components/billing/RazorpayButton.jsx
import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const RazorpayButton = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      // Create order
      const { data } = await api.post('/payment/create-order');

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'FocusFlow',
        description: 'Premium Subscription',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success('Payment successful! Welcome to Premium!');
            onSuccess?.();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
    >
      {loading ? 'Processing...' : 'Upgrade to Premium - ₹999/month'}
    </button>
  );
};

export default RazorpayButton;