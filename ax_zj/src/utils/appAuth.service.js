import { UserManager, User } from 'oidc-client';
import {Constants} from '../constants';

const settings = {
    authority: Constants.stsAuthority,
    client_id: Constants.clientId,
    redirect_uri: window.location.origin + '/signin-callback',
    post_logout_redirect_uri: window.location.origin + '/signout-callback',
    response_type: 'id_token token',
    scope: Constants.clientScope,
    // automaticSilentRenew: true,
    // filterProtocolClaims: true,
    loadUserInfo: true,
    AllowedCorsOrigins: [Constants.stsAuthority],
    AllowAccessToAllScopes: true
};
const _userManager = new UserManager(settings);

export const AppAuth = {
    getUser: () => {
        return _userManager.getUser();
    },

    signinCallback: () => {
        return _userManager.signinRedirectCallback();
    },

    login: () => {
        return _userManager.signinRedirect();
    },

    renewToken: () => {
        return _userManager.signinSilent();
    },

    logout: () => {
        return _userManager.signoutRedirect();
    },
}

