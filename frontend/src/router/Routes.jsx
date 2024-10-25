import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Importar las rutas de las features
import productRoutes from '../features/product/router/productRoutes'; 
import userRoutes from '../features/user/router/userRoutes'; 
import cuttingOrder from '../features/cuttingOrder/router/cuttingOrderRoutes';
import categoryRoutes from '../features/category/router/categoryRoutes'; // Importa las rutas de categorías

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Rutas generales */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Home />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Rutas modulares: Productos, Usuarios, Órdenes de corte y Categorías */}
      {cuttingOrder}    {/* Las rutas del módulo de Órdenes de corte */}
      {productRoutes}   {/* Las rutas del módulo de productos */}
      {userRoutes}      {/* Las rutas del módulo de usuarios */}
      {categoryRoutes}  {/* Las rutas del módulo de categorías */}
    </Routes>
  </Router>
);

export default AppRoutes;
