import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listUsers } from '../services/listUsers'; 
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import { useAuth } from '../../../hooks/useAuth';
import ActionButtonDropdown from '../components/ActionButtonDropdown';
import SearchInput from '../../../components/common/SearchInput';
import UserTable from '../components/UserTable';
import Pagination from '../components/Pagination';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null); // URL para la siguiente página
  const [previousPage, setPreviousPage] = useState(null); // URL para la página anterior
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Función para cargar los usuarios de una página específica
  const fetchUsers = async (url = '/users/list/') => {
    setLoadingUsers(true);
    try {
      const data = await listUsers(url); // Llamar a la API con la URL correcta
      if (data && Array.isArray(data.results)) {
        setUsers(data.results); // Almacenar los usuarios
        setNextPage(data.next); // Guardar la URL de la siguiente página
        setPreviousPage(data.previous); // Guardar la URL de la página anterior
        setTotalPages(Math.ceil(data.count / 10)); // Suponiendo que tienes 10 usuarios por página
      } else {
        setError(new Error('Error en el formato de los datos de la API'));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Efecto para verificar autenticación y cargar usuarios
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/'); // Redirigir al Home si no está autenticado
        return;
      }
      fetchUsers(); // Cargar usuarios de la primera página
    }
  }, [isAuthenticated, loading, navigate]);

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    if (page === 'next' && nextPage) {
      fetchUsers(nextPage); // Cargar la siguiente página
      setCurrentPage((prev) => prev + 1);
    } else if (page === 'previous' && previousPage) {
      fetchUsers(previousPage); // Cargar la página anterior
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading || loadingUsers) return <p>Cargando...</p>; // Mostrar mensaje mientras carga la autenticación o los usuarios
  if (error) return <p>Error cargando usuarios: {error.message}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col p-2 mt-14">
          <div className="flex justify-between items-center py-4">
            <ActionButtonDropdown />
            <SearchInput placeholder="Buscar usuarios" onSearch={(query) => console.log(query)} />
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            <UserTable users={users} />
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserList;
