/**
 * @module Router
 * @description кастомный роутер
 */
import { LandingPage } from '@/pages/LandingPage';
import { findMatch } from './findMatch';
import { appState } from '@/shared/config/router';

let pageInstance = null;

/**
 * Инициализирует и отрисовывает страницу по указанному пути
 * @async
 * @function router
 * @param {string} [path='/'] - URL путь для отображения
 * @returns {Promise<void>}
 */
export const router = async (path = '/') => {
    const root = document.getElementById('root');

    if (pageInstance) {
        pageInstance.destroy();
    }

    const ViewClass = findMatch(path) || LandingPage;
    pageInstance = new ViewClass(appState);

    root.innerHTML = '';
    root.appendChild(pageInstance.render());
};

/**
 * Переход на новый URL без перезагрузки страницы
 * @async
 * @function navigate
 * @param {string} path - Путь для перехода
 * @returns {Promise<void>}
 */
export const navigate = async (path) => {
    appState.currentPath = path;
    window.history.pushState(appState, '', path);

    await router(path);
};

/**
 * Обработчик нажатия кнопок "назад"/"вперёд" в браузере
 * @event popstate
 * @param {PopStateEvent} event - Событие изменения истории
 */
window.addEventListener('popstate', (event) => {
    const path = event.state?.currentPath || window.location.pathname;
    router(path);
});
