import { ConfirmPopupProps } from '../model/types';
import './style.scss';

import { stringToElement } from '@/shared/utils';

import template from './ConfirmPopup.hbs?compiled';

export const ConfirmPopup = (props: ConfirmPopupProps): Promise<boolean> => {
    return new Promise<boolean>((resolve) => runPopup(props, resolve));
};

const runPopup = (props: ConfirmPopupProps, resolve: (value: boolean) => void): void => {
    const html = template(props);
    const popup = stringToElement(html) as HTMLDialogElement;

    document.body.appendChild(popup);
    popup.showModal();

    popup.querySelector('.confirm-popup__confirm')?.addEventListener('click', () => {
        popup.close();
        resolve(true);
    });

    popup.querySelector('.confirm-popup__cancel')?.addEventListener('click', () => {
        popup.close();
        resolve(false);
    });

    popup.addEventListener('close', () => {
        popup.remove();
        resolve(false);
    });
};
