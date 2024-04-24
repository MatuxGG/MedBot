const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/modals/*/*.js`)).map(async modalFile => {
        const modal = require(modalFile);

        if (!modal.name) {
            return console.log(`--------\nModal not loaded: No name\n${modalFile}\n--------`);
        }

        client.modals.set(modal.name, modal);

        console.log(`Modal loaded: ${modal.name}`);
    })
}
