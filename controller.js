import View from './view.js';
import Compare from './compare.js';

export default class Controller {

  constructor(compare, view) {
   this.compare = compare;
   this.view = view;
  }

  getStarted() {
    this.view._clickOnStartButton(this.compare, this._fromModelToView);
  }

  getStopped() {
    this.view._clickOnStopButton(this.compare);
  }

  _fromModelToView(progressIndex, compareButtonDisabled, fastestTime, fastestCode, differenceSpeed, errorMessage) {
    view._progreesBar(progressIndex);
    view._compareButtonState(compareButtonDisabled);
    view._innerResult(fastestTime, fastestCode, differenceSpeed, errorMessage);
  }

}

let compare = new Compare();
let view = new View();
let controller = new Controller(compare, view);


controller.getStarted();
controller.getStopped();
