import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import template from './MapPage.hbs?compiled';
import styles from './style.module.scss';

export class MapPage extends BasePage {
  protected override template = template;
  protected override styles = styles;
  protected override pageClassName = 'page';

  private mapInstance: L.Map | null = null;
  private readonly lat: number;
  private readonly lon: number;
  private readonly zoom: number;

  constructor(appState: AppState) {
    super(appState);
    const params = new URLSearchParams(window.location.search);
    this.lat = parseFloat(params.get('lat')!) || 55.751244;
    this.lon = parseFloat(params.get('lon')!) || 37.618423;
    this.zoom = parseInt(params.get('zoom')!) || 15;
  }

  public static async create(appState: AppState): Promise<MapPage> {
  return new MapPage(appState);
  }

  protected override _render(): HTMLElement {
    const element = super._render();
    setTimeout(() => this.initMap(), 0);
    return element;
  }

  private initMap() {
    const container = this.element?.querySelector('#map') as HTMLElement;
    if (!container) return;

    this.mapInstance = L.map(container).setView([this.lat, this.lon], this.zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(this.mapInstance);

    L.marker([this.lat, this.lon]).addTo(this.mapInstance);

    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.mapInstance?.invalidateSize();
  };

  protected override _destroy(): void {
    window.removeEventListener('resize', this.handleResize);
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
    super._destroy();
  }
}