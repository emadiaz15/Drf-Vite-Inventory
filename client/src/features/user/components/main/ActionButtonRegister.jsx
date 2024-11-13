import React, { useState } from 'react';
import UserRegisterModal from '../register/UserRegisterModal'; // Importa el modal

const ActionButtonRegister = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddUser = () => {
    setIsModalOpen(true);  // Abrir el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // Cerrar el modal
  };

  const handleSaveUser = (newUserData) => {
    console.log('Nuevo usuario:', newUserData);
    // Aquí puedes agregar la lógica para guardar el nuevo usuario, por ejemplo, enviar los datos al backend.
    setIsModalOpen(false);  // Cerrar el modal después de guardar
  };

  return (
    <div>
      <button
        onClick={handleAddUser}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        type="button"
      >
        Nuevo Usuario
      </button>

      {isModalOpen && (
        <UserRegisterModal
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default ActionButtonRegister;
