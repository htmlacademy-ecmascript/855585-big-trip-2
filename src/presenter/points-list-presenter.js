import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import CreationFormView from '../view/creation-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import {render} from '../render.js';

//Создадим класс, включающий в себя отрисовку остальных связанных компонентов
export default class PointsListPresenter {
  pointsListViewComponent = new PointsListView();

  constructor({container, pointsModel, offersModel, destinationsModel}) {
  //Данные из main.js сохранили внутри класса
    this.container = container;
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  //Отрисовка компонентов
  init() {
    this.points = [...this.pointsModel.getPoints()];
    this.offers = [...this.offersModel.getOffers()];
    this.destinations = [...this.destinationsModel.getDestinations()];

    this.renderComponents();
  }

  renderComponents() {
    render(new EditFormView({ point: this.points[0], offers: this.offers, destinations: this.destinations }), this.pointsListViewComponent.element);
    render(new CreationFormView({ point: this.points[1], offers: this.offers, destinations: this.destinations }), this.pointsListViewComponent.element);
    render(this.pointsListViewComponent, this.container);

    for (let i = 2; i < this.points.length; i++) {
      render(new PointView({ point: this.points[i], offers: this.offers, destinations: this.destinations }), this.pointsListViewComponent.element);
    }
  }
}
