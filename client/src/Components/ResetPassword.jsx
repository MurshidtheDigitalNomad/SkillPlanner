import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import tracker from '../assets/tracker.svg';

const ResetPassword = () => {
  const sentences = ["Plan. Track. Grow.", "Build your own roadmap.", "Master your skills with AI."];
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const token = searchParams.get("token");

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

  useEffect(() => {
    if (!token) {
      setMessage("❌ Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setMessage("❌ Invalid reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:8000/api/auth/reset-password", {
        token,
        password
      });
      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Error resetting password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
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
          <h2 className="text-3xl font-semibold font-rubik mb-8 text-red-600">Invalid Reset Link</h2>
          <p className="font-poppins text-lg text-red-600 mb-6">❌ Invalid or missing reset token.</p>
          <Link to="/signin" className="text-[#2d39e8] font-poppins hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
        <h2 className="text-3xl font-semibold font-rubik mb-8">Reset Your Password</h2>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
          />
          
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
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
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 font-poppins text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        )}

        <p className="mt-4 font-poppins">
          Remember your password? <Link to="/signin" className="text-[#2d39e8] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
