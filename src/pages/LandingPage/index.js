import template from './LandingPage.hbs?compiled';
import './style.scss';

export const LandingPage = (props) => {
    const page = document.createElement('div');
    const html =  template(props);

    page.classList.add('page-wrapper');
    page.innerHTML = html;

    return page;
};
