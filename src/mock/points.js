import {getRandomArrayElement} from '../utils/common.js';
import {nanoid} from 'nanoid';

export const points = [
  {
    id: '1',
    basePrice: 1100,
    dateFrom: '2025-07-10T22:55:56.845Z',
    dateTo: '2025-07-11T11:22:13.375Z',
    destination: '2',
    isFavorite: false,
    offers: ['3', '4'],
    type: 'taxi'
  },
  {
    id: '2',
    basePrice: 1200,
    dateFrom: '2024-02-24T20:58:55.845Z',
    dateTo: '2024-02-28T12:24:14.375Z',
    destination: '1',
    isFavorite: true,
    offers: [],
    type: 'bus'
  },
  {
    id: '3',
    basePrice: 1300,
    dateFrom: '2024-09-13T23:53:50.845Z',
    dateTo: '2024-09-14T18:24:15.375Z',
    destination: '3',
    isFavorite: false,
    offers: ['17'],
    type: 'flight'
  },
];

//Функция для получения рандомных точек
function getRandomPoint() {
  return {
    ...getRandomArrayElement(points), // Сначала распыляем данные точки
    id: nanoid()
  };
}

export {getRandomPoint};
