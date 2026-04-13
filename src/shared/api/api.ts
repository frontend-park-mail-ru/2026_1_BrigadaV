import { ApiError } from './lib/ApiError';
import { LoginDTO, PlaceDTO, PlaceSummaryDTO, RegisterDTO, ReviewDTO, TripDTO, UserDTO } from './types';

const API_URL = import.meta.env.DEV ? 'http://localhost:8080/api' : 'http://212.233.96.48:8080/api';

const request = async (path: string, options: RequestInit) => {
    const url = `${API_URL}${path}`;

    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
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

    getUserTripList: async (): Promise<TripDTO[]> => {
        return request('/trips', {
            method: 'GET',
        })
    },

    getTripById: async (tripId: number): Promise<TripDTO> => {
        return {
            id: 1,
            title: 'Поиск лепреконов',
            start_date: new Date(2026, 2, 5).toISOString(),
            end_date: new Date(2026, 2, 17).toISOString(),
            location: {
                id: 1,
                name: 'City',
                country: 'Country',
                latitude: 1,
                longitude: 1,
            },
            preview: '/mock/place/tripbig.png',
            created_at: new Date(2026, 2, 1).toISOString(),
            updated_at: new Date(2026, 2, 1).toISOString(),
            created_by: 1,
            is_public: true,
        }
    },

    getPlacesByTrip: async (tripId: number): Promise<PlaceSummaryDTO[]> => {
        return [
            {
                id: 1,
                name: 'Place 1',
                description: 'Desc1',
                rating: 3.2,
                image: '/mock/place/place1.png',
            },
            {
                id: 2,
                name: 'Place 2',
                description: 'Desc2',
                rating: 5.0,
                image: '/mock/place/place2.png',
            }
        ]
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
    }
};
