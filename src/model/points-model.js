import Observable from '../framework/observable.js';
import dayjs from 'dayjs';
import { UpdateType } from '../const.js';


//Модель точек маршрутов
export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }


  //Получим данные из свойства points
  get points() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch (err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  get newPoint() {
    return {
      id: 'new',
      basePrice: 0,
      dateFrom: dayjs().toISOString(),
      dateTo: dayjs().toISOString(),
      destination: '',
      isFavorite: false,
      offers: [],
      type: 'flight',
    };
  }

  updatePoint(updateType, update) {
    //Ищем точку по уникальному id
    const index = this.#points.findIndex((point) => point.id === update.id);

    //Если не находим - выбрасываем ошибку
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    //Начинаем выплнять обновление
    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    //Уведомялем подписчиков о событиии
    this._notify(updateType, update);
  }

  //Добавляем в массив инфо по новой точке Передаем тип изменений и объект с изменениями
  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    //Уведомялем подписчиков о событиии
    this._notify(updateType, update);
  }

  //Удлаляем эдемент
  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    //Уведомлем о типе изменений
    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'], // На клиенте дата хранится как экземпляр Date
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}


