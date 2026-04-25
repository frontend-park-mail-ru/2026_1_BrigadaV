import './style.module.scss';

import { stringToElement } from '@/shared/utils';
import { IframeProps } from '../model/types';
import template from './Iframe.hbs?compiled';
import styles from './style.module.scss';

type IframeState = 'idle' | 'loading' | 'success' | 'error';

export class Iframe {
  element: HTMLElement | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private currentSrc: string;
  private isVisible: boolean;
  private state: IframeState = 'idle';

  constructor(private props: IframeProps) {
    this.currentSrc = props.src || '';
    this.isVisible = props.visible ?? false;
    if (this.currentSrc && this.isVisible) this.state = 'loading';
    this.element = this.render();
  }

  render(): HTMLElement {
    this.element = this._render();
    this.attachListeners();
    return this.element;
  }

  mountTo(container: HTMLElement) {
    container.appendChild(this.element!);
    this.attachListeners();
  }

  destroy() {
    this.element?.remove();
    this.element = null;
    this.iframe = null;
  }

  show() {
    if (this.isVisible) return;
    this.isVisible = true;
    if (this.currentSrc) this.state = 'loading';
    this.rerender();
  }

  hide() {
    if (!this.isVisible) return;
    this.isVisible = false;
    this.state = 'idle';
    this.iframe?.removeAttribute('src');
    this.rerender();
  }

  toggle() {
    this.isVisible ? this.hide() : this.show();
  }

  setSrc(url: string) {
    if (url === this.currentSrc) return;
    this.currentSrc = url;
    this.state = url && this.isVisible ? 'loading' : 'idle';
    if (this.element) this.rerender();
  }

  private handleLoad = () => {
    this.state = 'success';
    this.rerender();
  };

  private handleError = () => {
    this.state = 'error';
    this.rerender();
  };

  private _render(): HTMLElement {
    return stringToElement(template({
      styles,
      s: styles,
      ...this.props,
      src: this.currentSrc,
      visible: this.isVisible,
      isIdle: this.state === 'idle',
      isLoading: this.state === 'loading',
      isLoaded: this.state === 'success',
      isError: this.state === 'error',
    }));
  }

  private attachListeners() {
    this.iframe = this.element?.querySelector('iframe') ?? null;
    this.iframe?.addEventListener('load', this.handleLoad);
    this.iframe?.addEventListener('error', this.handleError);
  }

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