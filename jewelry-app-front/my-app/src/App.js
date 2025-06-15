import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Імпорт компонентів
import AuthComponent from './components/Auth/AuthComponent';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import MaterialsManager from './components/Materials/MaterialsManager';
import ProductsManager from './components/Products/ProductsManager';
import OrdersManager from './components/Orders/OrdersManager';
import Analytics from './components/Analytics/Analytics';

// Імпорт сервісів
import * as authService from './services/authService';
import * as dataService from './services/dataService';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Дані
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Перевірка збереженої сесії
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
      loadAllData();
    }
    setLoading(false);
  }, []);

  const loadAllData = async () => {
    try {
      const [materialsData, productsData, ordersData] = await Promise.all([
        dataService.getMaterials(),
        dataService.getProducts(),
        dataService.getOrders()
      ]);
      
      setMaterials(materialsData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      await authService.login(username, password);
      setCurrentUser(username);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', username);
      await loadAllData();
      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setMaterials([]);
    setProducts([]);
    setOrders([]);
  };

  const refreshData = {
    materials: () => dataService.getMaterials().then(setMaterials),
    products: () => dataService.getProducts().then(setProducts),
    orders: () => dataService.getOrders().then(setOrders)
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Завантаження...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <AuthComponent onLogin={handleLogin} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <div className="row g-0 min-vh-100">
          <div className="col-md-3 col-lg-2">
            <Sidebar
              user={currentUser}
              onLogout={handleLogout}
            />
          </div>
          <div className="col-md-9 col-lg-10">
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <Dashboard materials={materials} products={products} orders={orders} />
                } />
                <Route path="/materials" element={
                  <MaterialsManager materials={materials} onRefresh={refreshData.materials} />
                } />
                <Route path="/products" element={
                  <ProductsManager products={products} materials={materials} onRefresh={refreshData.products} />
                } />
                <Route path="/orders" element={
                  <OrdersManager orders={orders} products={products} onRefresh={refreshData.orders} />
                } />
                <Route path="/analytics" element={
                  <Analytics orders={orders} materials={materials} products={products} />
                } />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;