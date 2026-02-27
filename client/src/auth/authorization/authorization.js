async function getAuth() {
    try {
        const response = await fetch('/api/auth', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return { message: "Unauthorized", isAdmin: false };
        }

        return data;
    }
    catch (error) {
        return { message: "Unauthorized", isAdmin: false };
    }
}

export default getAuth;
