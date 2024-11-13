import React, { useState } from 'react';
import PasswordResetModal from './PasswordResetModal'; // Asegúrate de la ruta correcta

const UserEditModal = ({ user, onClose, onSave, onPasswordReset }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    dni: user.dni,
    is_active: user.is_active,
    is_staff: user.is_staff,
    password: '',
    confirmPassword: '',
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSave(user.id, formData); // Guardar cambios
    } catch (error) {
      setError(error.message || 'Error al actualizar el usuario');
    }
  };

  const handleRestorePassword = () => {
    setShowPasswordModal(true);
  };

  const handleSaveNewPassword = async (userId, newPasswordData) => {
    try {
      await onPasswordReset(userId, newPasswordData); // Llamar la función pasada para cambiar la contraseña
      setSuccessMessage('Contraseña cambiada exitosamente');
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      setShowPasswordModal(false);
    } catch (error) {
      setError('Error al cambiar la contraseña');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md w-1/2">
          <h2 className="text-2xl mb-4">Editar Usuario</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            {/* Campos de edición del formulario */}
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Guardar
              </button>
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
