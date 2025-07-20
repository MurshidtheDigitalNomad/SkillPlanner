import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/Sidebar";
import resourceicon from "../assets/resourceshortcut.svg"
import taskviewer from "../assets/taskviewer.svg"
import progresstracker from "../assets/progress-tracker.svg"
import communityshortcut from "../assets/communityshortcut.svg"

const Homepage = () => {
    return (
        <div className="flex min-h-screen w-full">
            
            <div className=" w-[85vw] flex flex-col ">
               
                <div className="shortcuts flex flex-col gap-8 mr-10 w-full">
                  
                    <div className="flex gap-8 w-full">

                        <div className="bg-white rounded-xl shadow flex-1 h-80 flex flex-col">
                            <div className="flex items-center gap-2 font-rubik text-xl font-extrabold mt-5 ml-5">
                                <img src={progresstracker} className="w-10 h-10" alt="progress tracker"/>
                                <span>YOUR CURRENT PROGRESS</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow flex-1 h-80 flex flex-col">
                            <div className="flex items-center gap-2 font-rubik text-xl font-extrabold mt-5 ml-5">
                                <img src={taskviewer} className="w-10 h-10"/>
                                <span>JULY 15, 2025</span>
                            </div>
                        </div>
                    </div>

                  
                    <div className="flex gap-8 w-full">

                        <div className="bg-white rounded-xl shadow" style={{width: '35%'}}>
                            <div className="h-80 flex flex-col">
                                <div className="flex items-center gap-2 font-rubik text-xl font-extrabold mt-5 ml-5">
                                    <img src={resourceicon} className="w-10 h-10"/>
                                    <span>CHECK OUT UPDATES FROM RESOURCE HUB</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow" style={{width: '65%'}}>
                            <div className="h-80 flex flex-col ">
                                <div className="flex items-center gap-2 font-rubik text-xl font-extrabold mt-5 ml-5">
                                    <img src={communityshortcut} className="w-10 h-10"/>
                                    <span>WHAT'S HAPPENING IN THE COMMUNITY TODAY?</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;