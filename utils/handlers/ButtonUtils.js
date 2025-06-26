const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/buttons/*/*.js`)).map(async buttonFile => {
        const button = require(buttonFile);

        if (!button.name) {
            return console.log(`--------\nButton not loaded: No name\n${buttonFile}\n--------`);
        }

        client.mbuttons.set(button.name, button);

        console.log(`Button loaded: ${button.name}`);
    })
}
