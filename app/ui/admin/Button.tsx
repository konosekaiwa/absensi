import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  label: string; // Menambahkan label sebagai prop yang diharapkan
}

const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
      {label}
    </button>
  );
};

export default Button;
