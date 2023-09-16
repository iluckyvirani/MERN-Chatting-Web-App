import { authenticationService } from '../Services/authenticationService';

function authHeader() {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return {
            auth: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
        };
    } else {
        return {};
    }
}

export default authHeader;