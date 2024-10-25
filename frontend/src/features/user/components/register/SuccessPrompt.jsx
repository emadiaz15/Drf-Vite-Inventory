import React, { useEffect } from 'react';

const SuccessPrompt = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Cerrar automáticamente después de 5 segundos
    }, 5000);

    return () => clearTimeout(timer); // Limpiar temporizador cuando el componente se desmonte
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
      {message}
      <button onClick={onClose} className="ml-2 text-white font-bold">X</button>
    </div>
  );
};

export default SuccessPrompt;
