import type { PlaceDTO } from '@/shared/api/types';

const MOCK_ATTRACTION: PlaceDTO = {
  id: 1,
  name: 'Британский музей',
  description: 'Один из крупнейших музеев мира...',
  price: 0,
  is_liked: false,
  locality: {
    id: 1,
    name: 'Лондон',
    country: 'Великобритания',
    latitude: 51.5194,
    longitude: -0.1270,
  },
  category: { id: 2, name: 'Музей', description: '' },
  photos: [
    { id: 1, place_id: 1, file_path: '/mock/attraction/british1.jpg', is_main: true },
    { id: 2, place_id: 1, file_path: '/mock/attraction/british2.jpg', is_main: false },
    { id: 3, place_id: 1, file_path: '/mock/attraction/british3.jpg', is_main: false },
  ],
  created_at: new Date().toISOString(),
};

// Мок (потом с бэка)
export type Review = {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Антон Смирнов',
    rating: 5,
    text: 'Один из крупнейших музеев в мире! Очень интересные экспозиции. Много древних сокровищ.',
    date: 'март 2026 г.',
  },
  {
    id: 2,
    author: 'Katie',
    rating: 4,
    text: 'Я бы не поехала, если бы не греческий гид, который неоднократно жаловался на то, что мраморные скульптуры Элгина находятся в Британском музее',
    date: 'март 2026 г.',
  },
  {
    id: 3,
    author: 'Джон Сноу',
    rating: 5,
    text: 'Британский музей - поистине незабываемый опыт. Коллекция обширна и прекрасно курируется, на ней представлены сокровища со всех уголков мира.',
    date: 'март 2026 г.',
  },
];

export class AttractionModel {
  static async getAttraction(id: string): Promise<PlaceDTO> {
    //  return API.getPlaceById(id);
    console.log(`Загрузка места ${id}`);
    return MOCK_ATTRACTION;
  }

  static async getReviews(attractionId: string): Promise<Review[]> {
    // return API.getReviews(attractionId);
    return MOCK_REVIEWS;
  }
}