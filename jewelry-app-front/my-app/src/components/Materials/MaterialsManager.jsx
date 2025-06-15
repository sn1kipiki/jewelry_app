import React, { useState } from 'react';
import { Modal, Button, Form, Table, Alert, Spinner, Card } from 'react-bootstrap';
import { addMaterial, updateMaterialQuantity } from '../../services/dataService';

const MaterialsManager = ({ materials, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    type: '',
    quantity: '',
    unit: 'грами',
    pricePerUnit: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [quantityChange, setQuantityChange] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addMaterial(newMaterial);
      onRefresh();
      setShowModal(false);
      setNewMaterial({
        name: '',
        type: '',
        quantity: '',
        unit: 'грами',
        pricePerUnit: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (materialId) => {
    if (!quantityChange) return;

    try {
      await updateMaterialQuantity(materialId, parseFloat(quantityChange));
      onRefresh();
      setEditingId(null);
      setQuantityChange('');
    } catch (err) {
      setError(err.message);
    }
  };

  const materialTypes = ['золото', 'срібло', 'платина', 'паладій', 'мідь', 'інше'];

  return (
    <div className="materials-manager">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Управління матеріалами</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"></i> Додати матеріал
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {materials.length === 0 ? (
            <Alert variant="info">Немає матеріалів. Додайте перший матеріал.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Назва</th>
                  <th>Тип</th>
                  <th>Кількість</th>
                  <th>Одиниця</th>
                  <th>Ціна за одиницю</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id}>
                    <td>{material.name}</td>
                    <td>{material.type}</td>
                    <td>
                      {editingId === material.id ? (
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={quantityChange}
                          onChange={(e) => setQuantityChange(e.target.value)}
                          style={{ width: '100px' }}
                        />
                      ) : (
                        material.quantity
                      )}
                    </td>
                    <td>{material.unit}</td>
                    <td>{material.pricePerUnit} грн</td>
                    <td>
                      {editingId === material.id ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleUpdateQuantity(material.id)}
                          >
                            <i className="bi bi-check"></i>
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            <i className="bi bi-x"></i>
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setEditingId(material.id);
                            setQuantityChange('');
                          }}
                        >
                          <i className="bi bi-pencil"></i> Змінити
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Модальне вікно для додавання матеріалу */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Додати новий матеріал</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Назва матеріалу</Form.Label>
              <Form.Control
                type="text"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Тип матеріалу</Form.Label>
              <Form.Select
                value={newMaterial.type}
                onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                required
              >
                <option value="">Виберіть тип</option>
                {materialTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Початкова кількість</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={newMaterial.quantity}
                onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Одиниця виміру</Form.Label>
              <Form.Select
                value={newMaterial.unit}
                onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                required
              >
                <option value="грами">грами</option>
                <option value="карати">карати</option>
                <option value="штуки">штуки</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ціна за одиницю (грн)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={newMaterial.pricePerUnit}
                onChange={(e) => setNewMaterial({ ...newMaterial, pricePerUnit: e.target.value })}
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

export default MaterialsManager;