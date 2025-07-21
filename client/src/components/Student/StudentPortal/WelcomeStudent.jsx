import React from 'react';

const WelcomeStudent = () => {
  const message = 'Welcome to SKIT College !!!';

  return (
    <div className="welcome-container">
      <h1 className="welcome-heading">
        {message.split('').map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }} className="letter">
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default WelcomeStudent;
