import React from "react";
import skillplannertitle from "../../assets/skillplanner-main-title.svg";
import notification from "../../assets/notification-bell.svg";
import titlename from "../../assets/titlenamewobg.svg";
import profileicon from "../../assets/profileicon.svg";
import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="w-full h-[15vh] flex items-center justify-between px-6" style={{ background: 'linear-gradient(to right, #85b4fa, #e8f2f8)' }}>
            <Link to="/">
            <img src={titlename} alt="skillplanner-title" className="h-15 w-15" />
            </Link>
            <div className="flex items-center gap-4">
                <img src={notification} alt="notification-bell" className="h-10" />
                <div className="profilebox flex items-center bg-white rounded-xl px-3 py-1 mr-5 shadow">
                    <img src={profileicon} alt="profile-icon" className="h-8 w-8 mr-1" />
                    <p className="text-sm font-medium font-rubik text-gray-800">Murshidul Haque</p>
                </div>
            </div>
        </div>
    );
};

export default Navbar;  