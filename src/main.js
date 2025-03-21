import MainPresenter from './presenter/main-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import {render} from './framework/render.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic rS4gfS44wcl1sa2j';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const bodyElement = document.body;
const eventsContainerElement = bodyElement.querySelector('.trip-events');
const filtersContainerElement = bodyElement.querySelector('.trip-controls__filters');
const siteHeaderElement = bodyElement.querySelector('.trip-main');

//Создаем экземпляр класса модели точек
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
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
  destinationsModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainerElement,
  filterModel: filterModel,
  pointsModel: pointsModel,
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  mainPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, siteHeaderElement);

mainPresenter.init();
filterPresenter.init();
