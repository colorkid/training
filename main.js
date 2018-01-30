class Compare {

  constructor() {

  }

  _terminateWork() {
    this.worker.terminate();
  }
  
  _whatIsFaster(snippetOneValue, snippetTwoValue) {

    function worker_function() {
      const numberOfIterationForStatistic = 1000;
      
      onmessage = function(e) {
    
        try { 
          
          if (e.data[0].length === 0 || e.data[1].length === 0) {
            throw new Error("Заполните поля");
            postMessage(["error", err.name + "\n" + err.message + "\n" + err.stack]);
          }

          let timeOneIteration;
          let iterationIndex = 0;

          function timing(code) {
              let time = performance.now();
              eval(code);
              time = performance.now() - time;
              timeOneIteration = time.toFixed(5);
            };

          function averageTimeCalculation(code) {
            let arr = [];

            for(let i = 0; i < numberOfIterationForStatistic; i++){

                timing(code);
                arr.push(+timeOneIteration); // + because timeOneIteration is type String
                // 20 - is the number by which we divide the total number of iterations, (two snippets over numberOfIterationForStatistic iterations) to get 100.
                if (i % 20 === 0) {
                  iterationIndex++;
                  postMessage([iterationIndex]);
                }

              }
                let result = arr.reduce(function(sum, current) {
                return sum + current;
            });
              
            return result / arr.length;
          };

          let runTimeFirstSnippet = averageTimeCalculation(e.data[0]);
          let runTimeSecondSnippet = averageTimeCalculation(e.data[1]);

          if(runTimeFirstSnippet < runTimeSecondSnippet) {
            postMessage([[runTimeFirstSnippet, e.data[0]], [(runTimeSecondSnippet - runTimeFirstSnippet).toFixed(3)]]);
          }
          else {
            postMessage([[runTimeSecondSnippet, e.data[1]], [(runTimeFirstSnippet - runTimeSecondSnippet).toFixed(3)]]);
          }
            } 
        catch (err){
          postMessage(["error", err.name + "\n" + err.message]);
        }
      };
    }

    this.worker = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));
    this.worker.postMessage([snippetOneValue, snippetTwoValue]);

    this.worker.onmessage = function(e) {

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

      controller._fromModelToView(this.progressIndex, this.compareButtonDisabled, this.fastestTime, this.fastestCode, this.differenceSpeed, this.errorMessage);
    };
  }
};


class View {

  constructor() {
    this.compareButton = document.querySelector("#compare");
    this.stopButton = document.querySelector("#cancel");
  }

  _clickOnStartButton() {
    this.compareButton.addEventListener('click', () => {
      let snippetOneValue = document.querySelector("#snippetOne").value.trim();
      let snippetTwoValue = document.querySelector("#snippetTwo").value.trim();
      compare._whatIsFaster(snippetOneValue, snippetTwoValue);
    });
  }

  _innerResult(fastestTime, fastestCode = "", differenceSpeed = "...", errorMessage) {
    let snippetFaster = document.querySelector("#snippetFaster");
    let fasterTime = document.querySelector("#fasterTime");

    fasterTime.innerHTML = differenceSpeed;

    if(fastestTime === "e") {
      fasterTime.innerHTML = "...";
      snippetFaster.innerHTML = errorMessage;
    }

    else {
      snippetFaster.innerHTML = fastestCode;
    }
  };

  _progreesBar(progressIndex = 0){
    let progressLine = document.querySelector("#progressLine");
    let progressPercent = document.querySelector("#progressBarValue");

    progressLine.style.width = progressIndex + "%";
    progressPercent.innerText = progressIndex + "%";
  }

  _compareButtonState(compareButtonDisabled = true) {
    //control state of this.compareButton
    this.compareButton.setAttribute("disabled", "true");
    if(compareButtonDisabled === false) this.compareButton.removeAttribute("disabled");
  }

  _clickOnStopButton() {
    this.stopButton.addEventListener('click', () => {
      this._progreesBar(this.progressIndex);
      this._compareButtonState(false);
      this._innerResult(this.fastestTime, this.fastestCode, this.differenceSpeed, this.errorMessage);
      compare._terminateWork();
    });
  }
}


class Controller {

  constructor(compare, view) {
    this.compare = compare;
    this.view = view;
  }

  getStarted() {
    view._clickOnStartButton();
  }

  getStopped() {
    view._clickOnStopButton();
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