import { ApiError } from './lib/ApiError';
import { LoginDTO, PlaceDTO, PlaceSummaryDTO, RegisterDTO, ReviewDTO, TripDTO, UserDTO } from './types';

const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api' : 'http://212.233.96.48:8080/api';

let cachedCSRFToken: string | null = null;

const getCSRFToken = async (): Promise<string> => {

    if (cachedCSRFToken) return cachedCSRFToken;

    try {
        let response = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
        if (!response.ok && cachedCSRFToken) {
            cachedCSRFToken = null;
            response = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
        }

        const data = await response.json();
        cachedCSRFToken = data.csrf_token;
        return cachedCSRFToken || '';
    } catch (error) {
        console.error(error);
    }
    return '';
}

const request = async (path: string, options: RequestInit) => {
    const url = `${API_URL}${path}`;

    const method = options.method?.toUpperCase() ?? 'GET';
    // const needCSRF = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            // ...(needCSRF ? { 'X-CSRF-Token': await getCSRFToken() } : {}),
        },
        ...options,
    };

    // eslint-disable-next-line no-useless-catch
    try {
        const response = await fetch(url, defaultOptions);

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            const error = new ApiError(data);
            throw error;
        }

        return data;
    } catch (error) {
        // TODO Сделать вывод ошибок тост сообщением
        throw error;
    }
};

export const API = {
    register: async (name: string, login: string, password: string): Promise<RegisterDTO> => {
        return request('/register', {
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
                nickname: name
            })
        });
    },

    login: async (login: string, password: string): Promise<LoginDTO> => {
        return request('/login', {
            method: 'POST',
            body: JSON.stringify({ login, password }),
        });
    },

    me: async (): Promise<LoginDTO> => {
        return request('/user/me', {
            method: 'GET'
        });
    },

    logout: async (): Promise<void> => {
        return request('/logout', {
            method: 'POST',
        });
    },

    getPlaces: async (): Promise<PlaceDTO[]> => {
        return request('/places', {
            method: 'GET',
        });
    },

    getPlaceReviews: async (placeId: number): Promise<ReviewDTO[]> => {
        return request(`/places/${placeId}/reviews`, {
            method: 'GET'
        })
    },

    getUserById: async (): Promise<UserDTO> => {
        return request('/profile', {
            method: 'GET'
        })
    },

    updateUser: async ({ nickname, country, city, about }) => {
        return request('/profile', {
            method: 'PUT',
            body: JSON.stringify({ nickname, country, city, about }),
        });
    },

    uploadAvatar: async (file: FormData) => {
        return request('/profile/avatar', {
            method: 'POST',
            body: file,
        })
    },

    getUserTripList: async (): Promise<TripDTO[]> => {
        return request('/trips', {
            method: 'GET',
        })
    },

    getTripById: async (tripId: number): Promise<TripDTO> => {
        return request(`/trips/${tripId}`, {
            method: 'GET',
        });
    },

    getPlaceById: async (placeId: number): Promise<PlaceDTO> => {
        return request(`/places/${placeId}`, {
            method: 'GET',
        });
    },

    createReview: async ({ placeId, title, rating, content, createdAt }: {
        placeId: number,
        title: string,
        rating: number,
        content: string,
        createdAt: Date
    }) => {
        return request('/reviews', {
            method: 'POST',
            body: JSON.stringify({ place_id: placeId, title, rating, content, visit_data: createdAt }),
        })
    },

    deleteReview: async (reviewId: number) => {
        return request(`/reviews/${reviewId}`, {
            method: 'DELETE',
        })
    },

    createTrip: async ({ title, location, isPublic }) => {
        return request('/trips', {
            method: 'POST',
            body: JSON.stringify({ title, location, is_public: isPublic }),
        });
    },

    updateTrip: async (tripId: number, title: string, description: string, location: string, startDate: Date, endDate: Date) => {
        return request(`/trips/${tripId}`, {
            method: 'PUT',
            body: JSON.stringify({ title, description, location, start_date: startDate, end_date: endDate }),
        })
    },

    deleteTrip: async (tripId: number) => {
        return request(`/trips/${tripId}`, {
            method: 'DELETE',
        })
    },

    getAddedPlaces: async (tripId: number) => {
        return request(`/trips/${tripId}/places`, {
            method: 'GET',
        })
    },

    addPlaceToTrip: async (tripId: number, placeId: number, orderIndex: number) => {
        return request(`/trips/${tripId}/places`, {
            method: 'POST',
            body: JSON.stringify({ place_id: placeId, order_index: orderIndex }),
        })
    },

    removePlaceFromTrip: async (tripId: number, placeId: number) => {
        return request(`/trips/${tripId}/places/${placeId}`, {
            method: 'DELETE',
        })
    },
};
