"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";

const letters = ["e", "x", "u", "s"];

const container = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.9,
      staggerChildren: 0.2,
    },
  },
};

const fadeLetter = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, register, logout, error, clearError, loading: authLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 md:p-12 overflow-hidden">
      {/* GLOBAL BACKGROUND: Entire page background is clear */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tile-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* TILE: Central tile with glassmorphism (blurs the global background) */}
      <motion.div
        className="relative z-10 w-full max-w-6xl rounded-3xl overflow-hidden"
        style={{
          padding: "3px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* White inner border */}
        <div
          className="rounded-[22px] overflow-hidden"
          style={{ padding: "3px", background: "transparent" }}
        >
          {/* Tile content container with backdrop blur + frosted glass effect */}
          <div className="relative rounded-[20px] overflow-hidden min-h-[85vh] backdrop-blur-xl bg-white/10 border border-white/20">
            {/* Content overlaid on blurred tile area */}
            <div className="relative z-10 flex flex-col md:flex-row min-h-[85vh]">
              {/* LEFT SIDE */}
              <div className="flex-1 flex flex-col justify-center items-start px-10 md:px-20">
                {/* WRAPPER: Flex container keeps everything on the same line */}
                <div className="flex items-center mb-4">
                  {/* Animated "N" */}
                  <div className="mr-1 flex items-center">
                    <svg
                      width="36"
                      height="48"
                      viewBox="0 0 60 80"
                      className="overflow-visible"
                    >
                      <motion.line
                        x1="10"
                        y1="70"
                        x2="10"
                        y2="10"
                        stroke="black"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                      />
                      <motion.line
                        x1="10"
                        y1="10"
                        x2="50"
                        y2="70"
                        stroke="black"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.3, ease: "linear" }}
                      />
                      <motion.line
                        x1="50"
                        y1="70"
                        x2="50"
                        y2="10"
                        stroke="black"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.6, ease: "linear" }}
                      />
                    </svg>
                  </div>

                  {/* exus */}
                  <motion.div
                    className="text-5xl font-bold flex"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                  >
                    {letters.map((letter, index) => (
                      <motion.span key={index} variants={fadeLetter}>
                        {letter}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Life */}
                  <motion.div
                    className="text-5xl font-light ml-3 text-gray-800"
                    style={{ fontFamily: "cursive" }}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                  >
                    Life
                  </motion.div>
                </div>

                {/* Description */}
                <motion.p
                  className="mt-2 text-gray-900 text-lg max-w-md font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.6, duration: 0.5 }}
                >
                  Your all-in-one productivity ecosystem for study, planning,
                  fitness, and life optimization.
                </motion.p>

                <motion.p
                  className="text-gray-800 text-md mt-1 font-normal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.9, duration: 0.5 }}
                >
                  Build discipline. Maintain consistency. Unlock your peak
                  performance.
                </motion.p>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex-1 flex items-center justify-center px-10 md:px-20">
                <div className="w-full max-w-sm bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-4 border-black">
                  {user ? (
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
                      <p className="text-lg mb-6">{user.email}</p>
                      <div className="space-y-3">
                        <button
                          onClick={() => window.location.href = "/dashboard/tasks"}
                          className="w-full bg-emerald-500 text-black py-2.5 rounded-lg hover:opacity-90 transition font-bold"
                        >
                          Go to Dashboard
                        </button>
                        <button
                          onClick={logout}
                          className="w-full bg-black/10 text-black py-2.5 rounded-lg hover:bg-black/20 transition font-medium"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-semibold mb-6 text-left">
                        {isLogin ? "Welcome to NexusLife!" : "Join NexusLife"}
                        <br />
                        <span className="text-lg font-normal text-gray-600">
                          {isLogin ? "Let's get you started" : "Create your account"}
                        </span>
                      </h2>

                      {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 transition placeholder:text-gray-400 text-black"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Password
                          </label>
                          <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 transition placeholder:text-gray-400 text-black"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full bg-black text-white py-2.5 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
                        >
                          {authLoading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
                        </button>
                      </form>

                      <p className="text-center text-sm text-gray-600 mt-5">
                        {isLogin ? "Not joined yet? " : "Already have an account? "}
                        <button
                          type="button"
                          onClick={() => { setIsLogin(!isLogin); clearError(); }}
                          className="text-black font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                          {isLogin ? "Create an account" : "Log in"}
                        </button>
                      </p>

                      <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-sm text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-300" />
                      </div>

                      <button
                        id="google-login-btn"
                        type="button"
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-100 transition bg-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          alt="Google logo"
                          className="w-5 h-5"
                        />
                        Continue with Google
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
