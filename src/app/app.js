/**
 * @module App
 */
import { appState } from '@/shared/config/router.js';
import { navigate } from '@/shared/router/router';
import { API } from '@/shared/api/api';

/**
 * Инициализирует приложение:
 * - Проверяет авторизацию пользователя
 * - Настраивает обработчики навигации
 * - Запускает роутер
 * 
 * @async
 * @function App
 * @returns {Promise<void>}
 */
export const App = async () => {
    /**
     * Проверяем, авторизован ли пользователь
     * Если да — сохраняем данные в appState
     * Если нет — устанавливаем null
     */
    try {
        const user = await API.me();
        appState.currentUser = user;
    } catch {
        appState.currentUser = null;
    }

    /**
     * Глобальный обработчик кликов для навигации
     * Отлавливает клики по элементам с атрибутом data-link
     * 
     * @param {MouseEvent} event - Событие клика
     */
    document.addEventListener('click', (event) => {
        const link = event.target.closest('[data-link]');

        if (link) {
            event.preventDefault();

            const path = new URL(link.href).pathname;
            navigate(path);
        }
    });

    navigate('/');
};
