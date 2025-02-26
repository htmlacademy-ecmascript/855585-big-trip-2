import {FilterType} from '../const.js';
import {isPointsPassed, isPointsPlanned, isPointsCurrent} from './point.js';

//Объект ключи которого - названия фильтров, значения - функция возвращающая новый массив соответствующий фильтру
const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPointsPassed(point.dateFrom)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointsPlanned(point.dateTo)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointsCurrent(point.dateFrom, point.dateTo)),
};


export {filter};
