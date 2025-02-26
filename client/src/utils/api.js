// env import
const apiUrl = process.env.REACT_APP_API_URL;

// Utils imports
const { logError } = require('./logger');

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
