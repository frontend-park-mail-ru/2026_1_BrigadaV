import styles from './style.module.scss';

import { UserBio } from '@/entities/User';
import { ProfileNavigation } from '@/features/ProfileNavigation';
import { AppState, IPage } from '@/shared/model';
import { injectComponents } from '@/shared/utils';
import { AboutMe } from '@/widgets/AboutMe';
import { Header } from '@/widgets/Header';
import { SettingsModal } from '@/widgets/SettingsModal';

import { handleTabChange } from '../handlers/handleTabChange';
import template from './ProfilePage.hbs?compiled';

const SETTINGS_MODAL_ID = 'settings';

export class ProfilePage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private userBio?: UserBio;
    private navigation?: ProfileNavigation;
    private activeSection?: AboutMe;
    private settingsModal?: SettingsModal;

    constructor(private appState: AppState) {
        this.header = new Header({
            userSessionProps: {
                user: appState.currentUser,
            },
            withSearch: true,
        });

        this.userBio = new UserBio({
            user: this.user,
        });

        this.navigation = new ProfileNavigation({
            onTabChange: handleTabChange,
        });

        this.activeSection = new AboutMe({
            user: this.user,
            modalId: SETTINGS_MODAL_ID,
        });

        this.settingsModal = new SettingsModal({
            user: this.user,
            id: SETTINGS_MODAL_ID,
        });
    }

    private get user() {
        return this.appState.currentUser!;
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template({
            settingsModalId: SETTINGS_MODAL_ID,
            styles,
        });

        this.element.classList.add(styles['profile-page']);
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'bio': this.userBio,
            'navigation': this.navigation,
            'active-section': this.activeSection,
            'settings-modal': this.settingsModal,
        });

        return this.element;
    }

    public destroy(): void { }
}
