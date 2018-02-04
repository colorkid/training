onmessage = function(e) {
  const numberOfIterationForStatistic = 1000;
    
  try { 
          
    if (e.data[0].length === 0 || e.data[1].length === 0) {
      throw new Error("Заполните поля");
      postMessage(["error", err.name + "\n" + err.message + "\n" + err.stack]);
    }

    let timeOneIteration;
    let iterationIndex = 0;

    function timing(code) {
      let time = performance.now();
      let evl = eval.bind();
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
