const apiUrl = process.env.REACT_APP_API_URL;

export const fetchUser = async (id, token) => {
    try {
        const response = await fetch(`${apiUrl}/users/${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            localStorage.removeItem('token');
            throw new Error('Failed to fetch user');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        throw error;
    }
};