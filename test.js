const Reverso = require('reverso-api');
const reverso = new Reverso();
reverso.getContext('', 'English', 'Spanish').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});

reverso.getTranslation('cat', 'English', 'Spanish').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});