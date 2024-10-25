import React, { useState } from 'react';
import PasswordResetModal from '../main/PasswordResetModal';  // Importa el nuevo modal

const UserEditModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    dni: user.dni,
    is_active: user.is_active,
    is_staff: user.is_staff,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, formData);  // Guardar cambios
  };

  const handleRestorePassword = () => {
    // Abrimos el modal para cambiar la contraseña
    setShowPasswordModal(true);
  };

  const handleSaveNewPassword = (userId, newPassword) => {
    // Aquí puedes implementar la lógica para enviar la nueva contraseña al backend
    console.log('Nueva contraseña:', newPassword);

    // Si el backend confirma el cambio de contraseña, muestra el mensaje de éxito
    setShowPasswordModal(false);
    setSuccessMessage('Contraseña cambiada exitosamente');

    // Mostrar el mensaje de éxito por 2 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md w-1/2">
          <h2 className="text-2xl mb-4">Editar Usuario</h2>
          <form onSubmit={handleSubmit}>
            {/* Campos de edición */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Activo</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="is_staff"
                checked={formData.is_staff}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Administrador</label>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Guardar
              </button>
              {/* Botón para restaurar la contraseña */}
              <button
                type="button"
                onClick={handleRestorePassword}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              >
                Restaurar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para cambiar la contraseña */}
      {showPasswordModal && (
        <PasswordResetModal
          userId={user.id}
          onClose={() => setShowPasswordModal(false)}
          onSave={handleSaveNewPassword}
        />
      )}

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white p-4 rounded">
            {successMessage}
          </div>
        </div>
      )}
    </>
  );
};

export default UserEditModal;
