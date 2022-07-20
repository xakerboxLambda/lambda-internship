import inquirer from "inquirer";

async function main() {
    let answerArray = [];

    let i = 0;
    while (true) {
        let inputQuestions = [
            {
                type: 'input',
                name: 'userName',
                message: 'Enter your name, please. To cancel press \'ENTER\': ',
            },
        ]

        answerArray[i] = await inquirer.prompt(inputQuestions)

        if (answerArray[i]['userName'] === '') {
            answerArray.length = i; 
            break;
        }

        
        /*
        Почему бы все вопросики не вытащить в отдельный модуль за пределы основного файла?;)
        */
        inputQuestions = [{
            type: 'list',
            name: 'userGender',
            message: 'Choose your Gender: ',
            choices: ['Male', 'Female', 'Do not want to choose'],
        },
        {
            type: 'input',
            name: 'userAge',
            message: 'Enter your age: ',
            validate: async (input) => {
                if (isNaN(input)) {
                    return 'invalid input'
                }
                return true;
            }
        }
        ]

        answerArray[i] = { ...answerArray[i], ...await inquirer.prompt(inputQuestions) }; //соеденяю два обьекта 
        i++;
    }
    
    // Put away from this file

    const isAgree = [
        {
            type: 'confirm',
            name: 'Confirm',
            message: 'Would you like to search values in DB: ',
        }
    ]

    const isAgreeAnswer = await inquirer.prompt(isAgree);


    const searchElement = [
        {
            type: 'input',
            name: 'searchName',
            message: 'Enter user\'s name you want to find in DB: ',
        }
    ]


    if (isAgreeAnswer['Confirm']) {
        const searchElementAnswer = await inquirer.prompt(searchElement)

        const foundElement = answerArray.filter(it => searchElementAnswer['searchName'] === it['userName'])

        if (foundElement.length === 0) { // есть более милый вариант if (!foundElement.length) {...}
            console.log('Nothing was found');
            process.exit(0);
        } else{
            console.log(foundElement);
            process.exit(0);
        }

    } else {
        console.log('Have a nice day!')
        process.exit(0);
    }
}

main();
