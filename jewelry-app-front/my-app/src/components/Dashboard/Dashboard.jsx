import React from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';

const Dashboard = ({ materials, products, orders }) => {
  const activeOrdersCount = orders.filter(order => order.status === 'ACTIVE').length;
  const lowStockMaterials = materials.filter(material => material.quantity < 10).length;
  const totalProducts = products.length;

  const calculateTotalProfit = () => {
    return orders
      .filter(order => order.status === 'COMPLETED')
      .reduce((total, order) => total + (order.profit || 0), 0)
      .toFixed(2);
  };

  return (
    <div className="dashboard">
      <h2 className="mb-4">Головна панель</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Активні замовлення</Card.Title>
              <Card.Text className="display-4">{activeOrdersCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Матеріали з низьким запасом</Card.Title>
              <Card.Text className="display-4">{lowStockMaterials}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Доступні продукти</Card.Title>
              <Card.Text className="display-4">{totalProducts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Загальний прибуток</Card.Title>
              <Card.Text className="display-4">{calculateTotalProfit()} грн</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>Останні активні замовлення</h4>
            </Card.Header>
            <Card.Body>
              {activeOrdersCount === 0 ? (
                <Alert variant="info">Немає активних замовлень</Alert>
              ) : (
                <ul className="list-group">
                  {orders
                    .filter(order => order.status === 'ACTIVE')
                    .slice(0, 5)
                    .map(order => (
                      <li key={order.id} className="list-group-item">
                        <strong>Клієнт:</strong> {order.customerName} |{' '}
                        <strong>Телефон:</strong> {order.customerPhone} |{' '}
                        <strong>Сума:</strong> {order.totalPrice.toFixed(2)} грн
                      </li>
                    ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>Матеріали з низьким запасом</h4>
            </Card.Header>
            <Card.Body>
              {lowStockMaterials === 0 ? (
                <Alert variant="success">Усі матеріали у достатній кількості</Alert>
              ) : (
                <ul className="list-group">
                  {materials
                    .filter(material => material.quantity < 10)
                    .slice(0, 5)
                    .map(material => (
                      <li key={material.id} className="list-group-item">
                        <strong>{material.name}</strong> - {material.quantity} {material.unit}
                      </li>
                    ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;