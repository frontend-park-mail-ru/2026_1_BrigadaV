import './style.scss';

import { UserBio } from '@/entities/User/ui/UserBio';
import { ProfileNavigation } from '@/features/ProfileNavigation';
import { AppState, IPage } from '@/shared/model';
import { injectComponents } from '@/shared/utils';
import { Header } from '@/widgets/Header';
import { SettingsModal } from '@/widgets/SettingsModal';

import template from './ProfilePage.hbs?compiled';
import { handleTabChange } from '../handlers/handleTabChange';

export class ProfilePage implements IPage {
    private element?: HTMLElement;
    private header?: Header;
    private userBio?: UserBio;
    private navigation?: ProfileNavigation;
    private settingsModal?: SettingsModal;

    constructor(appState: AppState) {
        this.header = new Header({
            userSessionProps: {
                user: appState.currentUser,
            },
            withSearch: true,
        });

        if (appState.currentUser) {
            this.userBio = new UserBio({
                user: appState.currentUser,
            })
        }

        this.navigation = new ProfileNavigation({
            onTabChange: handleTabChange,
        });

        this.settingsModal = new SettingsModal({
            user: appState.currentUser,
            id: 'settings',
        })
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        const html = template();

        this.element.classList.add('profile-page');
        this.element.innerHTML = html;

        injectComponents(this.element, {
            'header': this.header,
            'bio': this.userBio,
            'navigation': this.navigation,
            'settings-modal': this.settingsModal,
        });

        return this.element;
    }

    public destroy(): void {
        this.header?.destroy();
    }
}
