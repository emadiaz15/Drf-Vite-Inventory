import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import ActionButtonDropdown from "../components/main/ActionButtonRegister";
import SearchInput from "../../../components/common/SearchInput";
import UserTable from "../components/list/UserTable";
import Pagination from "../components/list/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage"; // Importar el nuevo componente
import UserRegisterModal from "../components/register/UserRegisterModal";
import { listUsers } from "../services/listUsers";
import { useAuth } from "../../../hooks/useAuth";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Función para cargar los usuarios de una página específica
  const fetchUsers = async (url = "/users/list/") => {
    setLoadingUsers(true);
    try {
      const data = await listUsers(url);
      if (data && Array.isArray(data.results)) {
        setUsers(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setTotalPages(Math.ceil(data.count / 10));
      } else {
        setError(new Error("Error en el formato de los datos de la API"));
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
        navigate("/");
        return;
      }
      fetchUsers();
    }
  }, [isAuthenticated, loading, navigate]);

  const handlePageChange = (page) => {
    if (page === "next" && nextPage) {
      fetchUsers(nextPage);
      setCurrentPage((prev) => prev + 1);
    } else if (page === "previous" && previousPage) {
      fetchUsers(previousPage);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchUsers(); // Actualizar la lista de usuarios después de cualquier operación exitosa
  };

  const handleUserRegistration = () => {
    handleShowSuccess("¡Usuario registrado con éxito!");
    setShowRegisterModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col p-2 mt-14">
          <div className="flex justify-between items-center py-4">
            <ActionButtonDropdown
              onRegister={() => setShowRegisterModal(true)}
            />
            <SearchInput
              placeholder="Buscar usuarios"
              onSearch={(query) => console.log(query)}
            />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            <UserTable users={users} onUsersChange={fetchUsers} handleShowSuccess={handleShowSuccess} />
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
      {showSuccess && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showRegisterModal && (
        <UserRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSave={handleUserRegistration}
          showSuccessPrompt={handleShowSuccess} // Asegúrate de pasar correctamente esta función
        />
      )}
    </div>
  );
};

export default UserList;
