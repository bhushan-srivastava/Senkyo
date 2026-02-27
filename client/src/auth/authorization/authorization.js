import { clearAccessToken, getAccessToken } from "../token";

async function getAuth() {
    try {
        const token = getAccessToken();
        const response = await fetch('/api/auth', {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                clearAccessToken();
            }
            return { message: "Unauthorized", isAdmin: false };
        }

        return data;
    }
    catch (error) {
        return { message: "Unauthorized", isAdmin: false };
    }
}

export default getAuth;
