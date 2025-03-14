import MainPresenter from './presenter/main-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const bodyElement = document.body;
const eventsContainerElement = bodyElement.querySelector('.trip-events');
const filtersContainerElement = bodyElement.querySelector('.trip-controls__filters');

//Создаем экземпляр класса модели точек
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
//Передадим презентеру кроме контейнера модель точек через конструктор
const mainPresenter = new MainPresenter({
  container: eventsContainerElement,
  filtersContainer: filtersContainerElement,
  filterModel,
  pointsModel,
  offersModel,
  destinationsModel
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainerElement,
  filterModel: filterModel,
  pointsModel: pointsModel,
});

mainPresenter.init();
filterPresenter.init();
