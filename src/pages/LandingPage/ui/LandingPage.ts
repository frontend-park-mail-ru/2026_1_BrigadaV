import { AppState, IPage } from '@/shared/model';
import { injectComponents } from '@/shared/utils';
import { Header } from '@/widgets/Header';
import { Hero } from '@/widgets/Hero';
import { RecommendedList } from '@/widgets/RecommendedList';

import template from './LandingPage.hbs?compiled';
import styles from './style.module.scss';

export class LandingPage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private hero?: Hero;
    private recommendedList?: RecommendedList;

    private constructor(private appState: AppState) {}

    public static async create(appState: AppState): Promise<LandingPage> {
        const page = new LandingPage(appState);
        page.setupComponents();
        return page;
    }

    private setupComponents() {
        this.header = new Header({
            userSessionProps: {
                user: this.appState.currentUser
            }
        });

        this.hero = new Hero();

        this.recommendedList = new RecommendedList({
            user: this.appState.currentUser
        });
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({ styles });

        this.element.classList.add(styles['landing-page']);
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'hero': this.hero,
            'recommended-list': this.recommendedList,
        });

        return this.element;
    }

    public destroy(): void { }
}
