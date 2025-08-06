import React from 'react';
import homepageicon from "../assets/homepage-icon.svg"
import dashboard from "../assets/dashboard.svg"
import planner from "../assets/planner.svg"
import tracker from "../assets/tracker.svg"
import community from "../assets/community.svg"
import aimentor from "../assets/aimentor.svg"
import resourcehub  from "../assets/resourcehub.svg"
import {Link} from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="h-screen bg-white shadow flex flex-col items-center pt-0 z-40">
            
            <div className="flex items-center justify-center w-full" style={{ height: '80px' }}>
                <div className=" w-15 h-15 mt-10 "><button><img src={homepageicon}/></button></div>
            </div>
            
            <div className="flex flex-col items-center gap-8 mt-10 w-full">
                <div className="w-12 h-12 "><Link to='/dashboard'><img src={dashboard}/></Link></div> 
                <div className="w-12 h-12 "><Link to='/planner'><img src={planner}/></Link></div> 
                <div className="w-12 h-12 "><Link to="/tracker"><img src={tracker}/></Link></div> 
                <div className="w-12 h-12 "><button><img src={resourcehub}/></button></div> 
                <div className="w-12 h-12 "><button><img src={community}/></button></div> 
                <div className="w-12 h-12 "><button><img src={aimentor}/></button></div> 
            </div>
        </div>
    );
}

export default Sidebar;

