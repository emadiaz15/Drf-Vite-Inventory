import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/user/services/auth/logoutUser'; // Asumiendo que esta función llama al endpoint de logout

const Sidebar = () => {
  const navigate = useNavigate();

  // Funciones de navegación para cada botón
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/'); // Redirigir al login
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const goToProfile = () => navigate('/my-profile');
  const goToHome = () => navigate('/dashboard');
  const goToProducts = () => navigate('/product-list');
  const goToOrders = () => navigate('/cutting-orders');
  const goToUsers = () => navigate('/users-list');
  const goToComments = () => navigate('/comments');

  return (
    <aside className="w-64h-screen bg-zinc-800 text-white min-h-screen p-4 font-sans">
      <button 
        onClick={goToHome} 
        className="w-full text-left py-2 px-4 mb-4 bg-gray-700 rounded hover:bg-gray-600"
      >
        Inicio
      </button>
      <button 
        onClick={goToProfile} 
        className="w-full text-left py-2 px-4 mb-4 bg-gray-700 rounded hover:bg-gray-600"
      >
        Mi Perfil
      </button>
      <button 
        onClick={goToProducts} 
        className="w-full text-left py-2 px-4 mb-4 bg-gray-700 rounded hover:bg-gray-600"
      >
        Productos
      </button>
      <button 
        onClick={goToOrders} 
        className="w-full text-left py-2 px-4 mb-4 bg-gray-700 rounded hover:bg-gray-600"
      >
        Órdenes de Corte
      </button>
      <button 
        onClick={goToUsers} 
        className="w-full text-left py-2 px-4 mb-4 bg-gray-700 rounded hover:bg-gray-600"
      >
        Usuarios
      </button>
      <button 
        onClick={goToComments} 
        className="w-full text-left py-2 px-4 mb-4 bg-gray-700 rounded hover:bg-gray-600"
      >
        Comentarios
      </button>
      <button 
        onClick={handleLogout} 
        className="w-full text-left py-2 px-4 bg-red-600 rounded hover:bg-red-500"
      >
        Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;
