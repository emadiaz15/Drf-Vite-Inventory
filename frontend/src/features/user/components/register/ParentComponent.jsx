// Parent component where the modal is used
import React, { useState } from 'react';
import UserRegisterModal from './UserRegisterModal';
import { fetchUsers } from '../../services/listUsers'; // Función para recargar la lista

const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSave = () => {
    fetchUsers(); // Recargar la lista de usuarios
    setIsModalOpen(false); // Cerrar el modal
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Registrar nuevo usuario</button>
      {isModalOpen && (
        <UserRegisterModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      )}
      {/* Tu tabla o lista de usuarios */}
    </>
  );
};

export default ParentComponent;
