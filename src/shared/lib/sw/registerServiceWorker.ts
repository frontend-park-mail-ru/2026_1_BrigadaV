export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
        await navigator.serviceWorker.register('/sw.js');
    }
};
