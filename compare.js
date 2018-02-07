export default class Compare {
	
  _terminateWork() {
    this.worker.terminate();
  }
  
  _whatIsFaster(snippetOneValue, snippetTwoValue, fromModelToView) {

    let objForPostMessage = {
      snippetOne: snippetOneValue,
      snippetTwo: snippetTwoValue
    };

    this.worker = new Worker("worker.js");

    this.worker.postMessage([objForPostMessage]);

    this.worker.onmessage = function(e) {
	    let objFromWorker = e.data[0];
      fromModelToView(objFromWorker);
    };
  }
};
