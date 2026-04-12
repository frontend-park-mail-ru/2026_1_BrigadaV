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
        return [
            {
                id: 1,
                author: { id: 1, nickname: 'Author 1' },
                place_id: 1,
                rating: 5,
                title: 'Title 1',
                comment: 'Один из крупнейших музеев в мире! Очень интересные экспозиции.  Много древних сокровищ.',
                created_at: new Date(2026, 2, 1).toISOString(),
                updated_at: new Date(2026, 2, 1).toISOString(),
            },
            {
                id: 2,
                author: { id: 2, nickname: 'Author 2' },
                place_id: 1,
                rating: 5,
                title: 'Title 2',
                comment: 'Я бы не поехала, если бы не греческий гид, который неоднократно жаловался на то, что мраморные скульптуры Элгина находятся в Британском музее',
                created_at: new Date(2025, 2, 25).toISOString(),
                updated_at: new Date(2025, 2, 25).toISOString(),
            },
            {
                id: 3,
                author: { id: 3, nickname: 'Author 3' },
                place_id: 1,
                rating: 4,
                title: 'Title 3',
                comment: 'Британский музей - поистине незабываемый опыт. Коллекция обширна и прекрасно курируется, на ней представлены сокровища со всех уголков мира.',
                created_at: new Date(2026, 4, 14).toISOString(),
                updated_at: new Date(2026, 4, 14).toISOString(),
            }
        ]
    },

    getUserById: async (userId: number): Promise<UserDTO> => {
        return {
            id: 1,
            nickname: 'Somename',
            location: {
                id: 1,
                name: 'City',
                country: 'Country',
                latitude: 1,
                longitude: 1,
            },
            // about: 'My very cool about',
            comment_count: 0,
            created_at: new Date(2026, 4, 12).toISOString(),
            updated_at: new Date(2026, 4, 12).toISOString(),
        }
    },

    getUserTripList: async (userId: number): Promise<TripDTO[]> => {
        return [
            {
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
                preview: '/mock/place/trip1.png',
                created_at: new Date(2026, 2, 1).toISOString(),
                updated_at: new Date(2026, 2, 1).toISOString(),
                created_by: 1,
                is_public: true,
            },
            {
                id: 2,
                title: 'Отдых на курорте',
                location: {
                    id: 1,
                    name: 'City',
                    country: 'Country',
                    latitude: 1,
                    longitude: 1,
                },
                preview: '/mock/place/trip2.png',
                created_at: new Date(2026, 2, 1).toISOString(),
                updated_at: new Date(2026, 2, 1).toISOString(),
                created_by: 1,
                is_public: true,
            }
        ]
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
                id: 1,
                name: 'Place 1',
                description: 'Desc1',
                rating: 3.2,
                image: '/mock/place/place2.png',
            }
        ]
    },

    getPlaceById: async (placeId: number): Promise<PlaceDTO> => {
        return {
            id: 1,
            name: 'Британский музей',
            locality: {
                id: 1,
                name: 'City',
                country: 'Country',
                latitude: 1,
                longitude: 1,
            },
            price: 0,
            is_liked: true,
            rating: 4.6,
        }
    }
};
