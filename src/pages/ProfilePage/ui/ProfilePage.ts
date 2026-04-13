import { mapUser, UserBio } from '@/entities/User';
import { User } from '@/entities/User/model/types';
import { ProfileNavigation } from '@/features/ProfileNavigation';
import { API } from '@/shared/api';
import { AppState, IPage } from '@/shared/model';
import { injectComponents } from '@/shared/utils';
import { AboutMe } from '@/widgets/AboutMe';
import { Header } from '@/widgets/Header';
import { SettingsModal } from '@/widgets/SettingsModal';

import { handleTabChange } from '../handlers/handleTabChange';
import template from './ProfilePage.hbs?compiled';
import styles from './style.module.scss';
import { handleSubmit } from '../handlers/handleSettingsUpdate';

const SETTINGS_MODAL_ID = 'settings';

export class ProfilePage implements IPage {
    private user!: User;
    private element?: HTMLElement;
    private header?: Header;
    private userBio?: UserBio;
    private navigation?: ProfileNavigation;
    private activeSection?: AboutMe;
    private settingsModal?: SettingsModal;

    private constructor(private appState: AppState) { }

    public static async create(appState: AppState): Promise<ProfilePage> {
        const page = new ProfilePage(appState);

        const userData = await API.getUserById();
        page.user = mapUser(userData);

        page.setupComponents();

        return page;
    }

    private setupComponents() {
        this.header = new Header({
            userSessionProps: {
                user: this.appState.currentUser,
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
            userAuth: this.appState.currentUser!,
            id: SETTINGS_MODAL_ID,
            onSubmit: handleSubmit,
        });
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

    public destroy(): void {
        this.settingsModal?.destroy();
    }
}
