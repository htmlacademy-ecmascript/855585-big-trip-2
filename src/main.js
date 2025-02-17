import FiltersView from './view/filters-view.js';
import SortingView from './view/sorting-view.js';
import Presenter from './presenter/presenter.js';
import {render} from './render.js';
import PointsModel from './model/points-model.js';

const bodyElement = document.body;

const filtersContainerElement = bodyElement.querySelector('.trip-controls__filters');
const sortingContainerElement = bodyElement.querySelector('.trip-events');

//Создаем экземпляр класса модели точек
const pointsModel = new PointsModel();
//Передадим презентеру кроме контейнера модель точек через конструктор
const presenter = new Presenter({
  container: sortingContainerElement,
  pointsModel
});

//Рендер компонентов в контейнеры
render(new FiltersView(), filtersContainerElement);
render(new SortingView(), sortingContainerElement);


presenter.init();
