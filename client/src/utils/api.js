import { logError } from './logger';

// env import
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchUser = async (id, token) => {
    try {
        const response = await fetch(`${apiUrl}/users?` + new URLSearchParams({ id }), {
            headers: {
                Authorization: `${token}`,
            },
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        logError(error);
        throw error;
    }
};
