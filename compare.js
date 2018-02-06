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
    	console.log(e.data)
      //get the data for bar progress
      if(e.data.length === 1) {
        this.progressIndex = e.data[0];
      }
      //obtain the result of calculations
      else {
        this.fastestTime = e.data[0][0];
        this.fastestCode = e.data[0][1];
        this.differenceSpeed = e.data[1][0];
        this.errorMessage = e.data[1];
        this.compareButtonDisabled = false;
      }

      fromModelToView(this.progressIndex, this.compareButtonDisabled, this.fastestTime, this.fastestCode, this.differenceSpeed, this.errorMessage);
    };
  }
};
