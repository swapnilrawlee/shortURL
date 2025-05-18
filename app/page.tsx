'use client'
import axios from 'axios';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShortUrl('');
    setQrCode('');
    setError('');

    try {
      const payload: any = { url: longUrl };
      if (customAlias.trim()) payload.custom_alias = customAlias.trim();

      const res = await axios.post('https://shorturl-backend-d11r.onrender.com/longUrl', payload);
      setShortUrl(res.data.shortUrl);
      setQrCode(res.data.qrCode);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Could not shorten the URL. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen dlex-col  items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 py-12 gap-10">
      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
          Shorten Your URL
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter long URL..."
            required
            className="w-full p-4 border text-black border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px rgba(99, 102, 241, 0.8)" }}
          />

          <motion.input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="Custom alias (optional)"
            className="w-full p-4 border text-black border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px rgba(99, 102, 241, 0.8)" }}
          />

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              'Shorten'
            )}
          </motion.button>
        </form>

        {/* Error Message inside form card */}
        <AnimatePresence>
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="mt-6 text-center text-red-600 font-semibold select-none"
              style={{ userSelect: 'none' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Container - separate card */}
      <AnimatePresence>
        {(shortUrl || qrCode) && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md p-6 bg-white bg-opacity-90 rounded-2xl shadow-lg flex flex-col items-center gap-6"
          >
            {shortUrl && (
              <div className="text-indigo-800 text-center">
                <p className="mb-2 font-semibold">Short URL:</p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline break-words text-lg"
                >
                  {shortUrl}
                </a>
              </div>
            )}

            {qrCode && (
              <img
                src={qrCode}
                alt="QR Code for short URL"
                className="w-40 h-40 rounded-lg shadow-lg"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
