onmessage = function(e) {
  let objFromWorkerToCompare = {};

  const numberOfIterationForStatistic = 1000;

  let snippetFirst = e.data[0].snippetOne;
  let snippetSecond = e.data[0].snippetTwo;

  try {
    
    if (snippetFirst.length === 0 || snippetSecond.length === 0) {
      throw new Error("empty fields");
      objFromWorkerToCompare.errorMessage = err.name + "\n" + err.message;
      objFromWorkerToCompare.disabledUi = false;
      postMessage([objFromWorkerToCompare]);
    }

    //pre validation snippets
    let evl = eval.bind();
    evl(snippetFirst);
    evl(snippetSecond);

    let timeOneIteration;
    objFromWorkerToCompare.iterationIndex = 0;

    function timing(code) {
      let time = performance.now();
      evl(code);
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
          objFromWorkerToCompare.iterationIndex++;
          postMessage([objFromWorkerToCompare]);
        }
      }

      let result = arr.reduce((sum, current) => {
        return sum + current;
      });

      return result / arr.length;
    };

    let runTimeFirstSnippet = averageTimeCalculation(snippetFirst);
    let runTimeSecondSnippet = averageTimeCalculation(snippetSecond);

    if(runTimeFirstSnippet < runTimeSecondSnippet) {
      objFromWorkerToCompare.fastestSnippetIndex = 0;
      objFromWorkerToCompare.fastestCode = snippetFirst;
      objFromWorkerToCompare.differenceSpeed = (runTimeSecondSnippet - runTimeFirstSnippet).toFixed(3);
    }

    else {
      objFromWorkerToCompare.fastestSnippetIndex = 1;
      objFromWorkerToCompare.fastestCode = snippetSecond;
      objFromWorkerToCompare.differenceSpeed = (runTimeFirstSnippet - runTimeSecondSnippet).toFixed(3);
    }

    objFromWorkerToCompare.runTimeFirstSnippet = runTimeFirstSnippet.toFixed(3);
    objFromWorkerToCompare.runTimeSecondSnippet = runTimeSecondSnippet.toFixed(3);
    objFromWorkerToCompare.disabledUi = false;
    postMessage([objFromWorkerToCompare]);
  }

  catch (err){
    objFromWorkerToCompare.errorMessage = err.name + "\n" + err.message;
    objFromWorkerToCompare.disabledUi = false;
    postMessage([objFromWorkerToCompare]);
  }
};
