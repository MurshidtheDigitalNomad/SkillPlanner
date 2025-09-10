import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import tracker from '../assets/tracker.svg';

const ForgotPassword = () => {
  const sentences = ["Plan. Track. Grow.", "Build your own roadmap.", "Master your skills with AI."];
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typing effect logic
  useEffect(() => {
    let timeout;

    if (isTyping) {
      if (charIndex < sentences[sentenceIndex].length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + sentences[sentenceIndex][charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 80);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      timeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayedText("");
        setIsTyping(true);
        setSentenceIndex((prev) => (prev + 1) % sentences.length);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, sentenceIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8000/api/auth/forgot-password", { email });
      setMessage("✅ Password reset link has been sent to your email.");
    } catch (err) {
      setMessage("❌ Error sending reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-12 flex flex-col justify-center items-start" style={{ background: 'linear-gradient(to right, #85b4fa, #e8f2f8)'}}>
        <div className="text-5xl text-[#393be5] font-rubik font-extrabold mb-6 h-20 flex items-center">
          <span>{displayedText}</span>
        </div>
        <p className="text-2xl font-poppins text-black max-w-md">
          Welcome to SkillPlanner — your smart assistant for structured skill development.
        </p>
        <div className="mt-10">
          <img src={tracker} alt="Floating icons" className="w-20 animate-bounce"/>
        </div>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center px-10">
        <h2 className="text-3xl font-semibold font-rubik mb-8">Forgot Your Password?</h2>
        <p className="text-gray-600 font-poppins mb-6 text-center">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded font-rubik text-xl font-bold mt-4 ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#2d39e8] hover:bg-blue-800"
            } text-white`}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 font-poppins text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        )}

        <p className="mt-6 font-poppins">
          Remember your password? <Link to="/signin" className="text-[#2d39e8] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
