import './style.module.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { stringToElement } from '@/shared/utils';
import { SupportWidget } from '@/widgets/SupportWidget';
import template from './Footer.hbs?compiled';
import styles from './style.module.scss';

export class Footer extends BaseComponent {
  private static supportWidget: SupportWidget | null = null;

  constructor(private props: { supportUrl?: string } = {}) {
    super();
  }

  protected override _render(): HTMLElement {
    return stringToElement(template({ styles, s: styles }));
  }

  protected override initListeners() {
    super.initListeners();
    this.attachSupportWidget();
  }

  private attachSupportWidget() {
    if (Footer.supportWidget) return; // уже создан

    const container = this.element?.querySelector('[data-ref="support-container"]');
    if (!container) return;

    Footer.supportWidget = new SupportWidget({
      supportUrl: this.props.supportUrl || '/support',
    });
    Footer.supportWidget.mountTo(container as HTMLElement);
  }
}