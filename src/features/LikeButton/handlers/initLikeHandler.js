export const initLikeHandler = (container) => {
    const likeButtons = container.querySelectorAll('.js-like-button');

    likeButtons.forEach(button => {
        button.addEventListener('click', handleClick);
    });
}

const handleClick = (event) => {
    event.target.classList.toggle('like--active');
}
