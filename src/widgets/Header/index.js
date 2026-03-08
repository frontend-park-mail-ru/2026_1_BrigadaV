import template from './Header.hbs?compiled';
import './style.scss';

import { SessionActions } from '@/features/sessionActions';

export const Header = (props) => {
    return template({
        sessionActions: SessionActions({
            user: props.user,
            className: "header__account"
        })
    });
}
