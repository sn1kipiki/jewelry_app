import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/auth';

// Налаштування axios
axios.defaults.timeout = 10000;

// Функція для входу в систему
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE}/login`, {
      username,
      password
    });
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Невірні дані для входу');
    }
  } catch (error) {
    if (error.response) {
      // Сервер відповів з помилкою
      throw new Error(error.response.data.error || 'Помилка на сервері');
    } else if (error.request) {
      // Запит був відправлений, але немає відповіді
      throw new Error('Немає відповіді від сервера. Перевірте підключення.');
    } else {
      // Помилка при створенні запиту
      throw new Error('Помилка при відправці запиту');
    }
  }
};

// Функція для реєстрації
export const register = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE}/register`, {
      username,
      password
    });
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Помилка реєстрації');
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Помилка реєстрації');
    } else if (error.request) {
      throw new Error('Немає відповіді від сервера. Перевірте підключення.');
    } else {
      throw new Error('Помилка при відправці запиту');
    }
  }
};

// Функція для перевірки статусу авторизації
export const checkAuthStatus = () => {
  return localStorage.getItem('currentUser') !== null;
};

// Функція для виходу
export const logout = () => {
  localStorage.removeItem('currentUser');
};