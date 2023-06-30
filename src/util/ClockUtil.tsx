import { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  const tick = () => {
    setTime(new Date());
  };

  return (
    <div>
      <h2 style={{fontSize:"2.5rem", color:"#A3BE32"}}>{time.toLocaleTimeString()}.</h2>
    </div>
  );
};

export default Clock;