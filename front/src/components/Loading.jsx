import { PulseLoader } from "react-spinners";
import React from "react";

const Loading = ({ color }) => (
    <div className="loading">
        <PulseLoader
            speedMultiplier={0.6}
            color={color}
            loading
            margin={15}
            size={40}
        />
    </div>
);

export default Loading;
