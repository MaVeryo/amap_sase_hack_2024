import React from 'react';
import { FlipWords } from "../../client/components/ui/flip-words";

const Home: React.FC = () => {
    const words = ["easier", "smoother", "faster"];

    return (
        <div className="flex flex-col items-center">
            <div className="h-[10rem] flex justify-center items-center px-4">
                <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                    Track your job applications
                    <FlipWords words={words} /> <br />
                    with AMAP
                </div>
            </div>
            <div className="flex space-x-4 mt-4">
                <button id="login" type="button" className="bg-gray-800 text-white p-2 rounded-md hover:bg-blue-400">
                    <a href="/#/login">Login</a>
                </button>
                <button id="newLogin" type="button" className="bg-gray-800 text-white p-2 rounded-md hover:bg-blue-400">
                    <a href="/#/about">Learn More</a>
                </button>
            </div>
        </div>
    );
};

export default Home;