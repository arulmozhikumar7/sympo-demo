import { useState, useEffect } from "react";
import "./CountdownTimer.scss"; // Import SCSS file

const CountdownTimer = () => {
  const targetDate = new Date("2025-03-15T09:00:00"); // March 15, 9 AM

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, mins: 0, secs: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      mins: Math.floor((difference / (1000 * 60)) % 60),
      secs: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.mins },
        { label: "Seconds", value: timeLeft.secs },
      ].map((item, index) => (
        <div key={index} className="countdown-box">
          <span className="countdown-value">{item.value}</span>
          <span className="countdown-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
