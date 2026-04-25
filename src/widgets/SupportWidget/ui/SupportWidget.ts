import './style.module.scss';

import { stringToElement } from '@/shared/utils';
import { Iframe } from '@/shared/ui/Iframe';
import type { SupportWidgetProps } from '../model/types';
import template from './SupportWidget.hbs?compiled';
import styles from './style.module.scss';

export class SupportWidget {
  element: HTMLElement | null = null;
  private isOpen = false;
  private iframe: Iframe | null = null;
  private readonly supportUrl: string;

  constructor(private props: SupportWidgetProps = {}) {
    this.supportUrl = props.supportUrl || '/support';
    this.element = this.render();
  }

  /** Вставка в DOM (аналог mountTo) */
  mountTo(container: HTMLElement) {
    container.appendChild(this.element!);
    this.attachListeners();
  }

  /** Удаление виджета */
  destroy() {
    this.element?.remove();
    this.element = null;
    this.destroyIframe();
  }

  private render(): HTMLElement {
    return stringToElement(template({ styles, s: styles, isOpen: this.isOpen }));
  }

  private attachListeners() {
    const root = this.element!;
    root.querySelector('[data-ref="trigger-btn"]')?.addEventListener('click', this.toggle);
    root.querySelector('[data-ref="close-btn"]')?.addEventListener('click', this.close);
    root.querySelector('[data-ref="overlay"]')?.addEventListener('click', this.close);
    this.createIframe();
  }

  private createIframe() {
    if (!this.isOpen) return;
    const wrapper = this.element?.querySelector('[data-ref="iframe-wrapper"]');
    if (!wrapper) return;
    this.iframe = new Iframe({
      src: this.supportUrl,
      title: 'Техническая поддержка',
      width: '100%',
      height: '100%',
      sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups',
      allow: 'camera; microphone',
      visible: true,
    });
    this.iframe.mountTo(wrapper as HTMLElement);
  }

  private destroyIframe() {
    this.iframe?.destroy();
    this.iframe = null;
  }

  private toggle = () => {
    this.isOpen ? this.close() : this.open();
  };

  private open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.rerender();
  }

  private close = () => {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.destroyIframe();
    this.rerender();
  };

  /** Перерисовка с сохранением родителя */
  private rerender() {
    if (!this.element) return;
    const parent = this.element.parentElement;
    if (!parent) return;
    const newEl = this.render();
    parent.replaceChild(newEl, this.element);
    this.element = newEl;
    this.attachListeners();
  }
}