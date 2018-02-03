export default class Compare {

  constructor() {

  }

  _terminateWork() {
    this.worker.terminate();
  }
  
  _whatIsFaster(snippetOneValue, snippetTwoValue, fromModelToView) {

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

      fromModelToView(this.progressIndex, this.compareButtonDisabled, this.fastestTime, this.fastestCode, this.differenceSpeed, this.errorMessage);
    };
  }
};
