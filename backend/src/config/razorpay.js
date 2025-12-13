// backend/src/config/razorpay.js
let razorpay = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const Razorpay = (await import('razorpay')).default;
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized');
  } else {
    console.warn('⚠️  Razorpay not configured - payment features disabled');
  }
} catch (error) {
  console.warn('⚠️  Razorpay initialization failed:', error.message);
}

export default razorpay;