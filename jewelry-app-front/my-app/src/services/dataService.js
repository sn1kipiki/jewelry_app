import axios from 'axios';
const API_BASE = 'http://localhost:8080';
// Налаштування axios
axios.defaults.timeout = 10000;

// Обробка помилок
const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.error || 'Помилка на сервері');
  } else if (error.request) {
    throw new Error('Немає відповіді від сервера. Перевірте підключення.');
  } else {
    throw new Error('Помилка при відправці запиту');
  }
};

// === МАТЕРІАЛИ ===
export const getMaterials = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/materials`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addMaterial = async (material) => {
  try {
    const response = await axios.post(`${API_BASE}/api/materials`, material);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateMaterialQuantity = async (id, quantityChange) => {
  try {
    const response = await axios.put(`${API_BASE}/api/materials/${id}/quantity`, {
      quantityChange
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// === ПРОДУКТИ ===
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/products`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/api/products/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addProduct = async (product, photo) => {
  try {
    const formData = new FormData();
    
    // Додаємо дані продукту як JSON рядок
    formData.append('product', JSON.stringify(product));
    
    // Додаємо фото якщо є
    if (photo) {
      formData.append('photo', photo);
    }

    const response = await axios.post(`${API_BASE}/api/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// === ЗАМОВЛЕННЯ ===
export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/orders`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getActiveOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/orders/active`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createOrder = async (productId, customerName, customerPhone) => {
  try {
    const response = await axios.post(`${API_BASE}/api/orders`, {
      productId,
      customerName,
      customerPhone
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const completeOrder = async (id) => {
  try {
    const response = await axios.put(`${API_BASE}/api/orders/${id}/complete`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getTotalProfit = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE}/api/orders/profit`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// === ДОПОМІЖНІ ФУНКЦІЇ ===

// Функція для валідації файлу зображення
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Підтримуються тільки файли JPEG, PNG та GIF');
  }

  if (file.size > maxSize) {
    throw new Error('Розмір файлу не повинен перевищувати 5MB');
  }

  return true;
};

// Функція для створення URL попереднього перегляду зображення
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Файл не вибрано'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Помилка читання файлу'));
    reader.readAsDataURL(file);
  });
};