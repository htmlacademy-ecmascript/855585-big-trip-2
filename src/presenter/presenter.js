import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import CreationFormView from '../view/creation-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import {render} from '../render.js';

//Создадим класс, включающий в себя отрисовку остальных связанных компонентов
export default class Presenter {
  pointsListViewComponent = new PointsListView();
  pointViewComponent = new PointView();
  creationFormViewComponent = new CreationFormView();
  editFormViewComponent = new EditFormView();

  //Конструируем класс
  constructor({container, pointsModel}) {
  //Данные из main.js сохранили внутри класса
    this.container = container;
    this.pointsModel = pointsModel;
  }

  //Отрисовка компонентов
  init() {
    this.points = [...this.pointsModel.getPoints()];
    //Отрисовка формы редактирвоания в списке
    render(this.editFormViewComponent, this.pointsListViewComponent.getElement());
    render(this.creationFormViewComponent, this.pointsListViewComponent.getElement());
    render(this.pointsListViewComponent, this.container);
    //Отрисовка нескольких компнонентов точки маршрута по количеству данных в модели
    for (let i = 0; i < this.points.length; i++) {
      render(new PointView({point: this.points[i]}), this.pointsListViewComponent.getElement());
    }
  }
}
