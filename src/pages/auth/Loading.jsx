import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RedirectPage = () => {
  const [countdown, setCountdown] = useState(5);
  const [redirectUrl, setRedirectUrl] = useState('');

  // Extract redirect URL from query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url') || 'https://example.com'; // Fallback URL
    setRedirectUrl(url);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = url;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, []);

  // Handle manual redirect
  const handleManualRedirect = () => {
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <motion.div
        className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Redirecting You...
        </motion.h1>
        <motion.p
          className="text-lg text-gray-300 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Taking you to your destination in{' '}
          <span className="text-indigo-400 font-semibold">{countdown}</span> seconds
        </motion.p>
        <div className="flex justify-center mb-6">
          <svg
            className="animate-spin h-12 w-12 text-indigo-400"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            />
          </svg>
        </div>
        <motion.div
          className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-6"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500" />
        </motion.div>
        <motion.button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          onClick={handleManualRedirect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Redirect Now
        </motion.button>
        <motion.p
          className="text-sm text-gray-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Not redirecting?{' '}
          <a href={redirectUrl} className="text-indigo-400 hover:underline">
            Click here
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RedirectPage;