import React, { useState } from 'react';
import UserEditModal from '../edit/UserEditModal';  // Importamos el componente modal
import PasswordResetModal from '../edit/PasswordResetModal'; // Importa el nuevo modal
import { updateUser } from '../../services/updateUser'; // Servicio para actualizar usuarios
import { deleteUser } from '../../services/deleteUser'; // Servicio para eliminar usuarios

const UserTable = ({ users, onUsersChange, handleShowSuccess }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);

  // Función para manejar la acción de editar
  const handleEdit = (user) => {
    setSelectedUser(user);  // Seleccionar el usuario para editar
  };

  // Función para manejar la acción de eliminar
  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await deleteUser(userId); // Llamar al servicio para eliminar el usuario
        handleShowSuccess('Usuario eliminado con éxito');
        onUsersChange(); // Actualizar la lista de usuarios después de la eliminación
      } catch (error) {
        console.error('Error al eliminar el usuario:', error.message);
        alert('Error al eliminar el usuario. Por favor, inténtelo de nuevo.');
      }
    }
  };

  // Cerrar el modal de edición
  const closeModal = () => {
    setSelectedUser(null);  // Limpiar el usuario seleccionado y cerrar el modal
  };

  // Guardar cambios en el usuario
  const handleSave = async (userId, updatedUserData) => {
    try {
      await updateUser(userId, updatedUserData); // Llamar al servicio para actualizar el usuario
      handleShowSuccess('Usuario actualizado con éxito');
      onUsersChange(); // Actualizar la lista de usuarios después de la edición
      closeModal();  // Cerrar el modal después de guardar
    } catch (error) {
      console.error('Error al actualizar el usuario:', error.message);
      alert('Error al actualizar el usuario. Verifique los datos e inténtelo de nuevo.');
    }
  };

  // Abrir el modal de restablecimiento de contraseña
  const openPasswordResetModal = (user) => {
    setUserToResetPassword(user);
    setShowPasswordModal(true);
  };

  // Cerrar el modal de restablecimiento de contraseña
  const closePasswordResetModal = () => {
    setUserToResetPassword(null);
    setShowPasswordModal(false);
  };

  // Manejar el restablecimiento de contraseña
  const handleSaveNewPassword = async (userId, newPassword) => {
    try {
      // Aquí deberías implementar la lógica para actualizar la contraseña en el backend
      console.log(`Restableciendo contraseña para el usuario ID ${userId}: ${newPassword}`);
      closePasswordResetModal();
      handleShowSuccess('Contraseña cambiada exitosamente');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      alert('Error al cambiar la contraseña. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Nombre de usuario</th>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">DNI</th>
            <th className="px-6 py-3">Imagen</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Administrador</th>
            <th className="px-6 py-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4">{user.username}</td>
              <td className="px-6 py-4">
                <div className="text-base font-semibold">{user.name} {user.last_name}</div>
              </td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.dni}</td>
              <td className="px-6 py-4">
                {user.image ? (
                  <img className="w-10 h-10 rounded-full" src={user.image} alt={`${user.name} profile`} />
                ) : (
                  <span>No image</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </div>
              </td>
              <td className="px-6 py-4">{user.is_staff ? 'Sí' : 'No'}</td>
              <td className="px-6 py-4 space-x-2">
                <button 
                  onClick={() => handleEdit(user)} 
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(user.id)} 
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mostrar el modal si se ha seleccionado un usuario */}
      {selectedUser && (
        <UserEditModal 
          user={selectedUser} 
          onClose={closeModal} 
          onSave={handleSave} 
          onPasswordReset={openPasswordResetModal}
        />
      )}

      {/* Mostrar el modal de restablecimiento de contraseña */}
      {showPasswordModal && userToResetPassword && (
        <PasswordResetModal
          userId={userToResetPassword.id}
          onClose={closePasswordResetModal}
          onSave={handleSaveNewPassword}
        />
      )}
    </>
  );
};

export default UserTable;
