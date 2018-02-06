onmessage = function(e) {
  const numberOfIterationForStatistic = 1000;

  let snippetFirst = e.data[0].snippetOne;
  let snippetSecond = e.data[0].snippetTwo;

    try { 

      if (snippetFirst.length === 0 || snippetSecond.length === 0) {
        throw new Error("Заполните поля");
        postMessage(["error", err.name + "\n" + err.message]);
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

        let result = arr.reduce((sum, current) => {
          return sum + current;
        });

        return result / arr.length;
      };

      let runTimeFirstSnippet = averageTimeCalculation(snippetFirst);
      let runTimeSecondSnippet = averageTimeCalculation(snippetSecond);

      if(runTimeFirstSnippet < runTimeSecondSnippet) {
        postMessage([[runTimeFirstSnippet, snippetFirst], [(runTimeSecondSnippet - runTimeFirstSnippet).toFixed(3)]]);
      }
      
      else {
        postMessage([[runTimeSecondSnippet, snippetSecond], [(runTimeFirstSnippet - runTimeSecondSnippet).toFixed(3)]]);
      }
    } 

    catch (err){
      postMessage(["error", err.name + "\n" + err.message]);
    }
};
