import {useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import './HomePage.css';
import { Link } from 'react-router-dom';
import cover from '../../assets/homepage-cover.svg';
import homeicon from '../../assets/homepage-icon.svg';
import signinicon from '../../assets/signin-icon.svg';
import plannerhome from '../../assets/planner-home.svg';
import trackerhome from '../../assets/tracker-home.svg';
import communityhome from '../../assets/community-home.svg';
import aimentorhome from '../../assets/aimentor-home.svg';
import resourcehubhome from '../../assets/resourcehub-home.svg';
import signupicon from '../../assets/signupicon.svg';

const HomePage= () => {
    const sentences = ["Plan. Track. Grow.", "Build your own roadmap.", "Master your skills with AI."];
    
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

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
        <div className= 'main flex flex-col items-center justify-center'>
            <div className= "header w-full h-[17vh] flex items-center justify-between px-6" style={{ background: 'linear-gradient(to right, #85b4fa, #e8f2f8)'}}>
                <img src={homeicon} alt="home-icon" className="h-20 w-20 ml-10" />
                <div className="flex items-center justify-center gap-4 mr-10">
                    <Link to='/signin'><button className='flex items-center gap-2 bg-white text-black border-2 border-black font-bold text-xl rounded-md px-6 py-3 font-rubik'><img src={signinicon}  className='h-6 w-6'/>Log In</button></Link>
                    <button className="flex items-center gap-2 bg-white text-black border-2 border-black font-bold text-xl rounded-md px-6 py-3 font-rubik ml-4"><img src={signupicon}  className='h-6 w-6'/>Sign Up</button>
                </div>
            </div>
            <div className= 'cover'>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                    <img src={cover} alt="cover" className= 'h-96 w-396'/>
                </motion.div>
                <h1 className= 'text-3xl font-extrabold text-center font-rubik mt-6 mb-3'>{displayedText}</h1>
                <div className= 'flex items-center justify-center gap-5 mt-6'>
                    <Link to='/signin'><button className= 'flex items-center gap-2 bg-[#d2edff] text-black px-4 py-2 font-rubik font-extrabold text-lg rounded-md border-2 border-black'>
                        <img src={signinicon} alt="signin-icon" className= 'h-6 w-6'/>
                        Get Started
                    </button></Link>
                    <button className= 'flex items-center gap-2 bg-[#d2edff] text-black px-4 py-2 font-rubik font-extrabold text-lg rounded-md border-2 border-black'>
                    <img src={signinicon} alt="signin-icon" className= 'h-6 w-6'/>
                    Learn More
                    </button>
                </div>
            </div>
            <div className='learn-more mt-10 w-full p-10' style={{ background: 'rgba(210, 235, 251, 0.3' }}>
                <div className='planner flex flex-col items-center justify-center align-items-center'>
                    <img src={plannerhome} alt="planner-home" className='h-25 w-110 ml-20' />
                    <p className='text-center font-rubik text-2xl font-extrabold pr-40 pl-40'>Break your big goals into achievable milestones. Our Skill Planner lets you define your learning path with clear objectives and deadlines — one skill at a time.</p>
                    <div className='p-20'></div>
                </div>
                <div className='tracker flex flex-col items-center justify-center align-items-center'>
                    <img src={trackerhome} alt="tracker-home" className='h-25 w-110 ml-10' />
                    <p className='text-center font-rubik text-2xl font-extrabold pr-40 pl-40'>Track your progress in real-time with an interactive timeline. Mark milestones complete, view percentage goals met, and stay motivated by seeing how far you’ve come.</p>
                    <div className='p-20'></div>
                </div>
                <div className='resourcehub flex flex-col items-center justify-center align-items-center'>
                    <img src={resourcehubhome} alt="resourcehub-home" className='h-25 w-110 ml-10' />
                    <p className='text-center font-rubik text-2xl font-extrabold pr-40 pl-40'>Access curated resources, guides, and tutorials tailored to your skill goals. Save time hunting for materials — we bring the best content to you.</p>
                    <div className='p-20'></div>
                </div>
                <div className='community flex flex-col items-center justify-center align-items-center'>
                    <img src={communityhome} alt="community-home" className='h-25 w-110 ml-10' />
                    <p className='text-center font-rubik text-2xl font-extrabold pr-40 pl-40'>Join a vibrant learning community. Share updates, get peer feedback, post wins, and discover what others are learning. Inspiration is just a scroll away.</p>
                    <div className='p-20'></div>
                </div>
                <div className='aimentor flex flex-col items-center justify-center align-items-center'>
                    <img src={aimentorhome} alt="aimentor-home" className='h-25 w-110 ml-10' />
                    <p className='text-center font-rubik text-2xl font-extrabold pr-40 pl-40'>Let our AI recommend skills, resources, and timelines based on your interests and goals. Think of it as your study coach — powered by intelligence.</p>
                    <div className='p-20'></div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;