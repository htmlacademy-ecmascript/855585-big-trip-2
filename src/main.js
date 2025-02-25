import PointsListPresenter from './presenter/points-list-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import {generateFilter} from './mock/filter.js';
import FiltersView from './view/filters-view.js';
import { render } from './framework/render.js';

const bodyElement = document.body;
const eventsContainerElement = bodyElement.querySelector('.trip-events');
const filtersContainerElement = bodyElement.querySelector('.trip-controls__filters');

//Создаем экземпляр класса модели точек
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
//Передадим презентеру кроме контейнера модель точек через конструктор
const pointsListPresenter = new PointsListPresenter({
  container: eventsContainerElement,
  filtersContainer: filtersContainerElement,
  pointsModel,
  offersModel,
  destinationsModel
});

const filters = generateFilter((pointsModel.points));
render(new FiltersView({filters}), filtersContainerElement);

pointsListPresenter.init();
