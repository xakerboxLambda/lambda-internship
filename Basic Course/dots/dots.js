function dots(str) {
    let result = [];
    let binaryMask = [];

    for (let i = 0; i < 2 ** (str.length - 1); i++) {
        binaryMask.push(i.toString(2)); // 0, 1, 10, 11, ...

        while (binaryMask[i].length < str.length - 1) {
            binaryMask[i] = '0' + binaryMask[i]; // 00, 01, 10, 11 ...
        }
        binaryMask[i] = binaryMask[i].split(''); // [ ['0','0'], ['0','1'], ['1','0'], ['1','1'], ... ]
    }

    result = binaryMask.map(value => { // ['0','0']
        let tmp = [];

        for (let i = 0; i < str.length; i++) {
            if (value[i] === '0') {
                tmp.push(str[i] + '');
            } else if (value[i] === '1') {
                tmp.push(str[i] + '.');
            } else if (i === str.length - 1) {
                tmp.push(str[str.length - 1]);
            }
        }
        return tmp.join('');
    })
    return result;
}

console.log(dots('abc'))