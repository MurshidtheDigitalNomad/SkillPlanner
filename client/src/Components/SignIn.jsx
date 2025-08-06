import { useState, useEffect } from "react";
import tracker from '../assets/tracker.svg'
import {Link} from 'react-router-dom';

function SignIn() {
  const sentences = ["Plan. Track. Grow.","Build your own roadmap.","Master your skills with AI."];

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
          setIsTyping(false); // Finished typing, start pause before next
        }, 1500); // pause after full sentence
      }
    } else {
      // Reset for next sentence
      timeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayedText("");
        setIsTyping(true);
        setSentenceIndex((prev) => (prev + 1) % sentences.length);
      }, 300); // short pause before typing next sentence
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, sentenceIndex]);

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
        <h2 className="text-3xl font-semibold font-rubik mb-8">Sign In to your account</h2>

        <form className="w-full max-w-sm space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
          />

          <Link to='/dashboard'><button className="bg-[#2d39e8] hover:bg-blue-800 text-white font-rubik text-xl font-bold py-2 px-4 rounded w-full">
            Login
          </button></Link>
        </form>
      </div>
    </div>
  );
}

export default SignIn;