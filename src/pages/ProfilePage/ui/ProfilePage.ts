import { fetchMe, UserBio } from '@/entities/User';
import { User } from '@/entities/User/model/types';
import { ProfileNavigation } from '@/features/ProfileNavigation';
import { BaseComponent } from '@/shared/lib/component/BaseComponent';
import { Callback } from '@/shared/lib/eventBus/eventBus';
import { BasePage } from '@/shared/lib/page/BasePage';
import { AppState } from '@/shared/model';
import { injectHandlerContext } from '@/shared/utils/lib/injectHandlerContext';
import { AboutMe } from '@/widgets/AboutMe';
import { DummyProfileSection } from '@/widgets/DummyProfileSection';
import { Header } from '@/widgets/Header';
import { SettingsModal } from '@/widgets/SettingsModal';

import { handleSettingsUpdate } from '../handlers/handleSettingsUpdate';
import template from './ProfilePage.hbs?compiled';
import styles from './style.module.scss';

const SETTINGS_MODAL_ID = 'settings';

export class ProfilePage extends BasePage {
    protected override template = template;
    protected override styles = styles;
    protected override pageClassName = 'profile-page';

    declare children: {
        header: Header;
        userBio: UserBio;
        navigation: ProfileNavigation;
        settingsModal: SettingsModal;
        activeSection: BaseComponent;
    };

    protected override get eventHandlers(): Record<string, Callback> {
        return {
            'Tabs:change': this.handleTabChange,
            'SettingsModal:submit': injectHandlerContext(handleSettingsUpdate, { user: this.user }),
        };
    }

    private user!: User;

    public static async create(appState: AppState): Promise<ProfilePage> {
        const page = new ProfilePage(appState);

        const user = await fetchMe();
        page.user = user;

        page.setupComponents();

        return page;
    }

    private setupComponents() {
        this.children = {
            header: new Header({
                user: this.user,
                withSearch: true,
            }),

            userBio: new UserBio({
                user: this.user,
            }),

            navigation: new ProfileNavigation({
                className: styles['user-profile__navigation'],
            }),

            settingsModal: new SettingsModal({
                user: this.user,
                id: SETTINGS_MODAL_ID,
            }),

            activeSection: new AboutMe({
                id: SETTINGS_MODAL_ID,
                hasAbout: Boolean(this.user.about),
                hasReviews: Boolean(this.user.hasReviews),
                joinDate: this.user.createdAt,
            }),
        };

    }

    private handleTabChange = (tabId: string) => {
        const container = this.element?.querySelector('.js-active-section');
        if (!container) return;

        const { activeSection: oldSection } = this.children;

        switch (tabId) {
        case 'about':
            this.children.activeSection = new AboutMe({
                id: SETTINGS_MODAL_ID,
                hasAbout: Boolean(this.user.about),
                hasReviews: Boolean(this.user.hasReviews),
                joinDate: this.user.createdAt,
            });
            break;
        case 'trips':
        case 'comments':
            this.children.activeSection = new DummyProfileSection();
            break;
        default:
            this.children.activeSection = new AboutMe({
                id: SETTINGS_MODAL_ID,
                hasAbout: Boolean(this.user.about),
                hasReviews: Boolean(this.user.hasReviews),
                joinDate: this.user.createdAt,
            });
        }

        const renderedSection = this.children.activeSection.render();
        renderedSection.classList.add('js-active-section', styles['active-section']);

        container.replaceWith(renderedSection);
        oldSection.destroy();
    };

    protected override getTemplateData(): Record<string, unknown> {
        return {
            settingsModalId: SETTINGS_MODAL_ID,
            styles
        };
    }
}
