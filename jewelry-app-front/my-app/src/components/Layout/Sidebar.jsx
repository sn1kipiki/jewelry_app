import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Sidebar = ({ currentView, setCurrentView, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Головна', icon: 'bi-house' },
    { id: 'materials', label: 'Матеріали', icon: 'bi-box-seam' },
    { id: 'products', label: 'Продукти', icon: 'bi-gem' },
    { id: 'orders', label: 'Замовлення', icon: 'bi-cart' },
    { id: 'analytics', label: 'Аналітика', icon: 'bi-graph-up' },
  ];

  return (
    <div className="sidebar d-flex flex-column bg-dark text-white p-3">
      <div className="sidebar-header mb-4">
        <h3 className="text-center">Ювелірна майстерня</h3>
      </div>

      <Nav className="flex-column mb-auto">
        {navItems.map((item) => (
          <Nav.Item key={item.id}>
            <LinkContainer to={`/${item.id}`}>
              <Nav.Link
                active={currentView === item.id}
                onClick={() => setCurrentView(item.id)}
                className="d-flex align-items-center"
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
        ))}
      </Nav>

      <div className="sidebar-footer mt-auto">
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-person-circle me-2"></i>
          <span>{user}</span>
        </div>
        <button
          onClick={onLogout}
          className="btn btn-outline-light w-100"
        >
          <i className="bi bi-box-arrow-right me-2"></i>Вийти
        </button>
      </div>
    </div>
  );
};

export default Sidebar;