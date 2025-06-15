import React, { useState } from 'react';
import { Card, Table, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { getTotalProfit } from '../../services/dataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = ({ orders, materials, products }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateMaterialUsage = () => {
    const materialUsage = {};

    orders.forEach(order => {
      if (order.status === 'COMPLETED') {
        const product = products.find(p => p.id === order.productId);
        if (product && product.materialsRequired) {
          Object.entries(product.materialsRequired).forEach(([materialId, quantity]) => {
            if (!materialUsage[materialId]) {
              materialUsage[materialId] = 0;
            }
            materialUsage[materialId] += quantity;
          });
        }
      }
    });

    return Object.entries(materialUsage).map(([materialId, quantity]) => {
      const material = materials.find(m => m.id === materialId);
      return {
        name: material ? material.name : 'Невідомий матеріал',
        quantity: parseFloat(quantity.toFixed(2)),
      };
    });
  };

  const calculateProductSales = () => {
    const productSales = {};

    orders.forEach(order => {
      if (order.status === 'COMPLETED') {
        const product = products.find(p => p.id === order.productId);
        const productName = product ? product.name : 'Невідомий продукт';
        if (!productSales[productName]) {
          productSales[productName] = 0;
        }
        productSales[productName]++;
      }
    });

    return Object.entries(productSales).map(([name, count]) => ({
      name,
      count,
    }));
  };

  const handleProfitCalculation = async () => {
    if (!startDate || !endDate) {
      setError('Будь ласка, введіть дати початку та кінця періоду');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        throw new Error('Дата початку не може бути пізніше дати кінця');
      }

      const profit = await getTotalProfit(start, end);
      setProfitData({
        startDate: start.toLocaleDateString(),
        endDate: end.toLocaleDateString(),
        totalProfit: profit,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const materialUsageData = calculateMaterialUsage();
  const productSalesData = calculateProductSales();

  return (
    <div className="analytics">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>Прибуток за період</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Дата початку</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Дата кінця</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      variant="primary"
                      onClick={handleProfitCalculation}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        'Розрахувати'
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {profitData && (
                <div className="mt-3">
                  <h5>
                    Загальний прибуток з {profitData.startDate} по {profitData.endDate}:
                  </h5>
                  <h3 className="text-success">
                    {profitData.totalProfit.toFixed(2)} грн
                  </h3>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>Використання матеріалів</h4>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={materialUsageData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" name="Кількість (гр)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>Продажі продуктів</h4>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productSalesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Кількість продаж" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;