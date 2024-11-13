import React, { useState, useEffect } from 'react';
import { listTypes } from '../services/listType'; // Importa el servicio para obtener los tipos
import { deleteType } from '../services/deleteType'; // Importar el servicio de eliminación de tipos
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import TypeToolbar from '../components/TypeToolbar'; // Similar a CategoryToolbar pero para tipos
import TypeCreateModal from '../components/TypeCreateModal'; // Modal para crear nuevos tipos
import TypeEditModal from '../components/TypeEditModal'; // Modal para editar tipos
import SuccessMessage from '../../../components/common/SuccessMessage'; // Importar el componente SuccessMessage

const TypesList = () => {
  const [types, setTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await listTypes();
      setTypes(response);
      setFilteredTypes(response);
    } catch (error) {
      console.error('Error al obtener los tipos:', error);
      setError('Error al obtener los tipos.');
    }
  };

  const handleSearch = (query) => {
    const filtered = types.filter((type) =>
      type.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTypes(filtered);
  };

  const handleCreateType = () => {
    setShowCreateModal(true);
  };

  const handleEditType = (type) => {
    setSelectedType(type);
    setShowEditModal(true);
  };

  const handleDeleteType = async (typeId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este tipo?")) {
      try {
        await deleteType(typeId);
        fetchTypes(); // Recargar tipos después de la eliminación
        showSuccessMessage('Tipo eliminado correctamente.');
      } catch (error) {
        console.error('Error al eliminar el tipo:', error);
        setError('No se pudo eliminar el tipo.');
      }
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000); // Ocultar después de 4 segundos
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 mt-14 rounded-lg">
          <div className="p-2 border-gray-200 rounded-lg dark:border-gray-700">
            <TypeToolbar onSearch={handleSearch} onCreate={handleCreateType} />
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded-lg">
                  <tr>
                    <th className="px-6 py-3">Nombre de Tipo</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTypes.map((type) => (
                    <tr key={type.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4">{type.name}</td>
                      <td className="px-6 py-4">{type.description}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button 
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                          onClick={() => handleEditType(type)}
                        >
                          Editar
                        </button>
                        <button 
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          onClick={() => handleDeleteType(type.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && <TypeCreateModal onClose={() => setShowCreateModal(false)} />}
      {showEditModal && (
        <TypeEditModal
          type={selectedType}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            fetchTypes(); // Recargar tipos después de la edición
            showSuccessMessage('Tipo editado correctamente.');
          }}
        />
      )}

      {/* Mensaje de éxito */}
      {showSuccess && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setShowSuccess(false)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default TypesList;
