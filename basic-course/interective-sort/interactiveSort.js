const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function readUserInput(rl, question) {
  return new Promise(resolve => {
    rl.question(question, resolve)
  })
}

function getNumbersFromArray(array){
  return array.filter(input => input == +input).map(Number);
}

function getWordsFromArray(array){
  return array.filter(input => input != +input);
}

function sortByAlphabet(array) {
  return getWordsFromArray(array).sort();
}

function sortFromSmallToBig(array) {
  return getNumbersFromArray(array).sort((a,b) => a - b);
}

function sortFromBigToSmall(array) {
  return getNumbersFromArray(array).sort((a,b) => b - a);
}

function sortByStringLength(array) {
    const resMap = {};
    array.forEach(it => {
        const value = resMap[it.length]
        if (value) {
            resMap[it.length] = [...value, it]
        } else {
            resMap[it.length] = [it]
        }
    });

    const sortedLengths = Object.keys(resMap).sort();

    return sortedLengths.map(it => resMap[it]).flat();
}


function uniqueWordsAndNumbers(array) {
  return [...new Set(array)];
}

function uniqueWords(array) {
  return sortByAlphabet(uniqueWordsAndNumbers(array));
}

async function main() {
  let answerArray;
  while (true) {
    const answer = await readUserInput(rl, `Enter 10 words or digits dividing them in spaces: `);

    answerArray = answer.split(/[ ]+/);

    if (answerArray.length !== 10) {
      console.log('You need to enter 10 words or digits. You entered only ' + answerArray.length);
      continue;
    } 

    const menuChoice = await readUserInput(rl,
      `\n         1) Отсортировать слова по алфавиту 
            2) Отобразить числа от меньшего к большему 
            3) Отобразить числа от большего к меньшему 
            4) Отобразить слова в порядке возрастания по количеству букв в слове
            5) Показать только уникальные слова 
            6) Показать только уникальные значения из всего введённого пользователем набора слов и чисел. 
            7) Для выхода из программы введите "exit"\n`);

    if (menuChoice === 'exit') {
      console.log('Have a nice day!');
      process.exit(0);
    }

    const menuChoiceAsNumber = +menuChoice;
    if (isNaN(menuChoiceAsNumber)) {
      console.log('Please enter the number from 1 to 6 or \'exit\': ');
      continue;
    }

    if (menuChoiceAsNumber < 1 && menuChoiceAsNumber > 6) {
      console.log('Please enter the number from 1 to 6 or \'exit\': ');
      continue;
    }

    if (menuChoiceAsNumber === 1) {
      console.log(sortByAlphabet(answerArray));
    } else if (menuChoiceAsNumber === 2) {
      console.log(sortFromSmallToBig(answerArray));
    } else if (menuChoiceAsNumber === 3) {
      console.log(sortFromBigToSmall(answerArray));
    } else if (menuChoiceAsNumber === 4) {
      console.log(sortByStringLength(answerArray));
    } else if (menuChoiceAsNumber === 5) {
      console.log(uniqueWords(answerArray));
    } else if (menuChoiceAsNumber === 6) {
      console.log(uniqueWordsAndNumbers(answerArray));
    } else {
      console.log('Please enter integer number from 1 to 6 or \'exit\': ');
      continue;
    }
  }

}
main();

