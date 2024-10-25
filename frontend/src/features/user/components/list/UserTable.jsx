import React, { useState } from 'react';
import UserEditModal from '../edit/UserEditModal';  // Importamos el componente modal

const UserTable = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Función para manejar la acción de editar
  const handleEdit = (user) => {
    setSelectedUser(user);  // Seleccionar el usuario para editar
  };

  // Función para manejar la acción de eliminar
  const handleDelete = (userId) => {
    console.log(`Deleting user with ID: ${userId}`);
    // Aquí agregarías la lógica para eliminar el usuario
  };

  // Cerrar el modal
  const closeModal = () => {
    setSelectedUser(null);  // Limpiar el usuario seleccionado y cerrar el modal
  };

  // Guardar cambios en el usuario
  const handleSave = (userId, updatedUserData) => {
    console.log(`Saving user with ID: ${userId}`, updatedUserData);
    // Aquí agregarías la lógica para guardar los cambios en el usuario
    closeModal();  // Cerrar el modal después de guardar
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
        />
      )}
    </>
  );
};

export default UserTable;
