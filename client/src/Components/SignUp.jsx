import { useState, useEffect } from "react";
import tracker from '../assets/tracker.svg'
import {Link} from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function SignUp() {
  const sentences = ["Plan. Track. Grow.","Build your own roadmap.","Master your skills with AI."];
  const navigate = useNavigate();

  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [userData, setUserData]= useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

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
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  const handleSignUp = async (e) =>{
    e.preventDefault();

    if(userData.password !== userData.confirmPassword){
      alert("Passwords do not match, please try again.");
      return;
    }
    try{
      const response = await axios.post('http://localhost:8000/api/users/signup', userData);
      console.log(response.data);
      if(response.status==201){
        alert("Sign up successful!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate(`/dashboard`);
      }else{
        alert("Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred during sign up. Please try again.");
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
        <h2 className="text-3xl font-semibold font-rubik mb-8">Set up your SkillPlanner account</h2>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Enter your Email Address"
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder=" Create a unique password"
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full p-3 font-poppins border border-gray-300 rounded-xl focus:outline-none"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
          />

          <p className="mt-2 font-poppins  text-sm">Already have an account? <Link to='/signin' className="text-[#2d39e8]">Sign back in</Link></p>
          <button
            className="bg-[#2d39e8] hover:bg-blue-800 text-white font-rubik text-xl font-bold mt-4 py-2 px-4 rounded w-full"
            type="submit"
          >
            Sign Up
          </button>
                  
        </form>

      </div>
    </div>
  );
}

export default SignUp;