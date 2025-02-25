import {FilterType} from '../const.js';
import {isPointsPassed, isPointsPlanned, isPointsCurrent} from './point.js';

//Объект ключи которого - названия фильтров, значения - функция возвращающая новый массив соответствующий фильтру
const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.PAST]: (points) => points.filter((point) => isPointsPassed(point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointsPlanned(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointsCurrent(point.dateTo, point.dateFrom)),
};

export {filter};
