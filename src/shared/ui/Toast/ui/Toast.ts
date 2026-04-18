import './style.scss';

import { stringToElement } from '@/shared/utils';

import { ToastProps } from '../model/types';
import template from './Toast.hbs?compiled';

export const Toast = (props: ToastProps) => {
    const toast = stringToElement(template(props));
    document.body.appendChild(toast);
    toast.showPopover();
    setTimeout(() => fade(toast), 3000);
}

const fade = (toast: HTMLElement) => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300)
}
