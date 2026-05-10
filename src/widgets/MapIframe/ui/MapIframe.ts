import './style.scss';

import { BaseComponent } from '@/shared/lib/component/BaseComponent';

import type { MapWidgetProps } from '@/widgets/MapIframe/model/types';
export class MapIframe extends BaseComponent<HTMLDivElement> {
    constructor(private readonly props: MapWidgetProps) {
        super();
    }

    protected _render(): HTMLDivElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'map-iframe';

        const iframe = document.createElement('iframe');
        iframe.className = 'map-iframe__frame';
        iframe.src = `/map?lat=${this.props.lat}&lon=${this.props.lon}&zoom=${this.props.zoom ?? 15}`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';

        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');

        wrapper.appendChild(iframe);
        return wrapper;
    }

    protected override _destroy(): void {
    }
}
