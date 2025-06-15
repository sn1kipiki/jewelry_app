import React, { useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner, Card, Tab, Tabs } from 'react-bootstrap';
import { createOrder, completeOrder, getActiveOrders } from '../../services/dataService';

const OrdersManager = ({ orders, products, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    productId: '',
    customerName: '',
    customerPhone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const activeOrders = orders.filter(order => order.status === 'ACTIVE');
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createOrder(
        newOrder.productId,
        newOrder.customerName,
        newOrder.customerPhone
      );
      onRefresh();
      setShowModal(false);
      setNewOrder({
        productId: '',
        customerName: '',
        customerPhone: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="orders-manager">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Управління замовленнями</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"></i> Нове замовлення
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="active" title="Активні">
              {activeOrders.length === 0 ? (
                <Alert variant="info">Немає активних замовлень</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Продукт</th>
                      <th>Клієнт</th>
                      <th>Телефон</th>
                      <th>Сума</th>
                      <th>Дата</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOrders.map((order) => {
                      const product = products.find(p => p.id === order.productId);
                      return (
                        <tr key={order.id}>
                          <td>{product ? product.name : 'Невідомий продукт'}</td>
                          <td>{order.customerName}</td>
                          <td>{order.customerPhone}</td>
                          <td>{order.totalPrice.toFixed(2)} грн</td>
                          <td>{new Date(order.createdAt).toLocaleString()}</td>
                          <td>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleCompleteOrder(order.id)}
                            >
                              <i className="bi bi-check-circle me-1"></i> Завершити
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Tab>
            <Tab eventKey="completed" title="Завершені">
              {completedOrders.length === 0 ? (
                <Alert variant="info">Немає завершених замовлень</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Продукт</th>
                      <th>Клієнт</th>
                      <th>Телефон</th>
                      <th>Сума</th>
                      <th>Прибуток</th>
                      <th>Дата створення</th>
                      <th>Дата завершення</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedOrders.map((order) => {
                      const product = products.find(p => p.id === order.productId);
                      return (
                        <tr key={order.id}>
                          <td>{product ? product.name : 'Невідомий продукт'}</td>
                          <td>{order.customerName}</td>
                          <td>{order.customerPhone}</td>
                          <td>{order.totalPrice.toFixed(2)} грн</td>
                          <td>{order.profit.toFixed(2)} грн</td>
                          <td>{new Date(order.createdAt).toLocaleString()}</td>
                          <td>{new Date(order.completedAt).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Модальне вікно для створення замовлення */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Нове замовлення</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Продукт</Form.Label>
              <Form.Select
                value={newOrder.productId}
                onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
                required
              >
                <option value="">Виберіть продукт</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.price.toFixed(2)} грн)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ім'я клієнта</Form.Label>
              <Form.Control
                type="text"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Телефон клієнта</Form.Label>
              <Form.Control
                type="tel"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Створення...</span>
                </>
              ) : (
                'Створити'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default OrdersManager;