import { useState, useEffect } from "react";
import tracker from '../assets/tracker.svg'
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from './Contexts/authContext.jsx';

function SignIn() {
  const sentences = ["Plan. Track. Grow.","Build your own roadmap.","Master your skills with AI."];
  const navigate = useNavigate();
  const { login } = useAuth();

  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [signInData, setSignInData] = useState({ email: "", password: "" });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/users/signin', signInData);
      if (response.status == 200) {
        alert("Sign in successful!");
        console.log("User data:", response.data.user);
        // Store user data in local storage for context
        localStorage.setItem("user", JSON.stringify(response.data.user));
        login(response.data.user);
        navigate('/dashboard');
      } else {
        alert("Sign in failed, please try again.");
      }
    } catch (error) {
      console.log("Error signing in:", error);
      alert("Sign in failed, please check your credentials.");
    }
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
        <h2 className="text-3xl font-semibold font-rubik mb-8">Sign In to your account</h2>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={signInData.email}
            onChange={handleChange}
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={signInData.password}
            onChange={handleChange}
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
          />
          <p className="mt-2 font-poppins text-sm">Forgot password? <Link to='/forgot-password' className="text-[#2d39e8]">Click here to reset your password</Link></p>

          <button 
          className="bg-[#2d39e8] hover:bg-blue-800 text-white font-rubik text-xl font-bold mt-4 py-2 px-4 rounded w-full"
          type='submit'
          >
            Login
          </button>
          
        </form>
        <p className="mt-2 font-poppins ">Don't have an account? <Link to='/signup' className="text-[#2d39e8]">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default SignIn;