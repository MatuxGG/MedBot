const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/menus/*/*.js`)).map(async menuFile => {
        const menu = require(menuFile);

        if (!menu.name) {
            return console.log(`--------\nMenu not loaded: No name\n${menuFile}\n--------`);
        }

        client.menus.set(menu.name, menu);

        console.log(`Menu loaded: ${menu.name}`);
    })
}
