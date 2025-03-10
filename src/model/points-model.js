import {getRandomPoint} from '../mock/points.js';
import Observable from '../framework/observable.js';

const POINT_COUNT = 5;

//Модель точек маршрутов
export default class PointsModel extends Observable {
  //Запишем в свойство массив точек
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);

  //Получим данные из свойства points
  get points() {
    return this.#points;
  }
}


