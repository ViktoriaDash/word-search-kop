import React from "react";

/**
 * Базовий компонент кнопки для гри.
 * * @component
 * @param {Object} props 
 * @param {string} props.label 
 * @param {function} props.onClick 
 * @returns {React.ReactElement} 
 */
const Button = ({ label, onClick }) => {
  return (
    <button className="btn" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;