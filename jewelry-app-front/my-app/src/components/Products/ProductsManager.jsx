import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { addProduct, getProducts, validateImageFile, createImagePreview } from '../../services/dataService';

const ProductsManager = ({ products, materials, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    materialsRequired: {},
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [materialQuantities, setMaterialQuantities] = useState({});

  useEffect(() => {
    // Ініціалізуємо кількість матеріалів для кожного продукту
    const initialQuantities = {};
    materials.forEach(material => {
      initialQuantities[material.id] = 0;
    });
    setMaterialQuantities(initialQuantities);
  }, [materials]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      const preview = await createImagePreview(file);
      setSelectedFile(file);
      setPreviewUrl(preview);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMaterialChange = (materialId, value) => {
    setMaterialQuantities({
      ...materialQuantities,
      [materialId]: parseFloat(value) || 0,
    });

    // Оновлюємо materialsRequired в стані продукту
    const updatedMaterials = { ...newProduct.materialsRequired };
    if (value) {
      updatedMaterials[materialId] = parseFloat(value);
    } else {
      delete updatedMaterials[materialId];
    }

    setNewProduct({
      ...newProduct,
      materialsRequired: updatedMaterials,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addProduct(newProduct, selectedFile);
      onRefresh();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      materialsRequired: {},
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setMaterialQuantities(
      materials.reduce((acc, material) => {
        acc[material.id] = 0;
        return acc;
      }, {})
    );
  };

  const calculateProductionCost = (product) => {
    if (!product.materialsRequired || !materials.length) return 0;

    return Object.entries(product.materialsRequired).reduce((total, [materialId, quantity]) => {
      const material = materials.find(m => m.id === materialId);
      if (material) {
        return total + (quantity * material.pricePerUnit);
      }
      return total;
    }, 0);
  };

  return (
    <div className="products-manager">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Управління продуктами</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"></i> Додати продукт
          </Button>
        </Card.Header>
        <Card.Body>
          {products.length === 0 ? (
            <Alert variant="info">Немає продуктів. Додайте перший продукт.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Фото</th>
                  <th>Назва</th>
                  <th>Опис</th>
                  <th>Ціна</th>
                  <th>Собівартість</th>
                  <th>Прибуток</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const cost = calculateProductionCost(product);
                  const profit = product.price - cost;
                  return (
                    <tr key={product.id}>
                      <td>
                        {product.photoUrl ? (
                          <img
                            src={product.photoUrl}
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.price.toFixed(2)} грн</td>
                      <td>{cost.toFixed(2)} грн</td>
                      <td className={profit >= 0 ? 'text-success' : 'text-danger'}>
                        {profit.toFixed(2)} грн
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Модальне вікно для додавання продукту */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Додати новий продукт</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Назва продукту</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Опис</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ціна (грн)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Фото продукту</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                  {previewUrl && (
                    <div className="mt-2">
                      <img
                        src={previewUrl}
                        alt="Попередній перегляд"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Необхідні матеріали</Form.Label>
                  {materials.map((material) => (
                    <div key={material.id} className="mb-2">
                      <Form.Label className="d-block">
                        {material.name} ({material.unit})
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        value={materialQuantities[material.id] || ''}
                        onChange={(e) => handleMaterialChange(material.id, e.target.value)}
                      />
                    </div>
                  ))}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Збереження...</span>
                </>
              ) : (
                'Зберегти'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsManager;