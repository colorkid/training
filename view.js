export default class View {

  constructor() {
    this.compareButton = document.querySelector("#compare");
    this.stopButton = document.querySelector("#cancel");
    this.snippetFaster = document.querySelector("#snippetFaster");
    this.fasterTime = document.querySelector("#fasterTime");
    this.snippetFields = document.querySelectorAll(".snippet__code");
    this.snippetResultTime = document.querySelectorAll(".snippet-result-js");
  }

  _clickOnStartButton(compare, fromModelToView) {
    this.compareButton.addEventListener('click', () => {
      let snippetOneValue = document.querySelector("#snippetOne").value.trim();
      let snippetTwoValue = document.querySelector("#snippetTwo").value.trim();
      compare._whatIsFaster(snippetOneValue, snippetTwoValue, fromModelToView);
    });
  }

  _innerResult(fastestCode = "", differenceSpeed = "...", errorMessage, runTimeFirstSnippet = "...", runTimeSecondSnippet = "...") {
    this.fasterTime.innerHTML = differenceSpeed;

    if(errorMessage) {
      this.fasterTime.innerHTML = "...";
      this.snippetFaster.innerHTML = errorMessage;
      this.snippetResultTime[0].innerHTML = "...";
      this.snippetResultTime[1].innerHTML = "...";

      return;
    }

    this.snippetFaster.innerHTML = fastestCode;
    this.snippetResultTime[0].innerHTML = runTimeFirstSnippet;
    this.snippetResultTime[1].innerHTML = runTimeSecondSnippet;
  };

  _markQuickSnippet(fastestSnippetIndex){
    this._removeMarkFields();
    if(!Number.isInteger(fastestSnippetIndex)) return;
    this.snippetFields[fastestSnippetIndex].classList.add("snippet__code--fastest");
  }

  _removeMarkFields(){
    for (let i = 0; i < this.snippetFields.length; i++){
       this.snippetFields[i].classList.remove("snippet__code--fastest");
    }
  }

  _progreesBar(progressIndex = 0){
    let progressLine = document.querySelector("#progressLine");
    let progressPercent = document.querySelector("#progressBarValue");

    progressLine.style.width = progressIndex + "%";
    progressPercent.innerText = progressIndex + "%";
  }

  _compareStateUi(disabledUi = true) {
    //control state of this.compareButton
    this.compareButton.setAttribute("disabled", "true");

    if(disabledUi === false) {
      this.snippetFields[0].removeAttribute("disabled");
      this.snippetFields[1].removeAttribute("disabled");
      this.compareButton.removeAttribute("disabled");
    }

    else {
      this.snippetFields[0].setAttribute("disabled", "true");
      this.snippetFields[1].setAttribute("disabled", "true");
      this.compareButton.setAttribute("disabled", "true");
    }
    
  }

  _clickOnStopButton(compare) {
    this.stopButton.addEventListener('click', () => {
      this._progreesBar(this.progressIndex);
      this._compareStateUi(false);
      this._innerResult();
      this._removeMarkFields();
      compare._terminateWork();
    });
  }
}
