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

  _fromModelToView(objFromWorker) {
    view._progreesBar(objFromWorker.iterationIndex);
    view._compareStateUi(objFromWorker.disabledUi);
    view._markQuickSnippet(objFromWorker.fastestSnippetIndex);
    view._innerResult(objFromWorker.fastestCode, objFromWorker.differenceSpeed, objFromWorker.errorMessage, objFromWorker.runTimeFirstSnippet, objFromWorker.runTimeSecondSnippet);
  }

}


let compare = new Compare();
let view = new View();
let controller = new Controller(compare, view);


controller.getStarted();
controller.getStopped();
