import FiltersView from './view/filters-view.js';
import SortingView from './view/sorting-view.js';
import PointsListPresenter from './presenter/points-list-presenter.js';
import {render} from './render.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const bodyElement = document.body;

const filtersContainerElement = bodyElement.querySelector('.trip-controls__filters');
const sortingContainerElement = bodyElement.querySelector('.trip-events');

//Создаем экземпляр класса модели точек
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
//Передадим презентеру кроме контейнера модель точек через конструктор
const pointsListPresenter = new PointsListPresenter({
  container: sortingContainerElement,
  pointsModel,
  offersModel,
  destinationsModel
});

//Рендер компонентов в контейнеры
render(new FiltersView(), filtersContainerElement);
render(new SortingView(), sortingContainerElement);


pointsListPresenter.init();
