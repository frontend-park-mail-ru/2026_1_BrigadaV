import { AppState, IPage } from '@/shared/model';

import { BaseComponent } from '../component/BaseComponent';

export abstract class BasePage extends BaseComponent implements IPage {
    protected abstract template: (data: any) => string;
    protected abstract styles: Record<string, string>;
    protected abstract pageClassName: string;

    protected constructor(protected appState: AppState) { super(); }

    protected getTemplateData(): Record<string, any> {
        return { styles: this.styles };
    }

    protected _render(): HTMLElement {
        this.element = document.createElement('div');
        this.element.classList.add(this.styles[this.pageClassName]);

        const html = this.template(this.getTemplateData());
        this.element.innerHTML = html;

        return this.element;
    }

    public override destroy(): void {
        super.destroy();
    }
}
