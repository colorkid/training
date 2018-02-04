export default class View {

  constructor() {
    this.compareButton = document.querySelector("#compare");
    this.stopButton = document.querySelector("#cancel");
  }

  _clickOnStartButton(compare, fromModelToView) {
    this.compareButton.addEventListener('click', () => {
      let snippetOneValue = document.querySelector("#snippetOne").value.trim();
      let snippetTwoValue = document.querySelector("#snippetTwo").value.trim();
      compare._whatIsFaster(snippetOneValue, snippetTwoValue, fromModelToView);
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

  _clickOnStopButton(compare) {
    this.stopButton.addEventListener('click', () => {
      this._progreesBar(this.progressIndex);
      this._compareButtonState(false);
      this._innerResult(this.fastestTime, this.fastestCode, this.differenceSpeed, this.errorMessage);
      compare._terminateWork();
    });
  }
}


