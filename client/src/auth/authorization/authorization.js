
import { apiFetch } from "../../api/fetchClient";

async function getAuth() {
    try {
        const { data } = await apiFetch('/api/auth', {
            method: 'GET'
        });
        return data;
    }
    catch (error) {
        return { message: "Unauthorized", isAdmin: false }
    }
}
export default getAuth;
