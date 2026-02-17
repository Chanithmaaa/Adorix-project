import React from 'react';

const AvatarOverlay = ({ state }) => {
    return (
        <div className="flex flex-col items-center justify-center text-white">
            <div className="w-64 h-64 bg-gray-800 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-lg mb-4">
                <span className="text-2xl font-bold">{state || "IDLE"}</span>
            </div>
            <p className="text-gray-400">Avatar Placeholder</p>
        </div>
    );
};

export default AvatarOverlay;
