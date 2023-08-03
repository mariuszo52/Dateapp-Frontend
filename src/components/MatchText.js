import React, { useState, useEffect } from "react";

const DisappearingText = ({ text, duration }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <div className={"match-notification"}>
            {isVisible && <p>{text}</p>}
        </div>
    );
};

export default DisappearingText;
