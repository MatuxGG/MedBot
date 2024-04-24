const fs = require('fs');
const { Guild } = require('../models/index');

const translations = {};

function loadTranslations(language) {
  try {
    const file = fs.readFileSync(`./locales/${language}.json`);
    translations[language] = JSON.parse(file);
    console.log(`Translations loaded: ${language}`);
  } catch (error) {
    console.error(`Translation load ERROR: ${language}`);
  }
}

async function trans(guildId, text, variables = {}) {
  return new Promise((resolve, reject) => {
      Guild.findOne({ id: guildId }, function (err, guild) {
          if (err) {
              console.log(`Trans error: ${err}`);
              resolve(translate('en', text, variables));
          }
  
          if (guild) {
              const lg = guild.lg ? guild.lg : 'en';
              resolve(translate(lg, text, variables));
          } else {
              console.log("Trans error: No Guild");
              resolve(translate('en', text, variables));
          } 
      });
  });
}

function translate(language, text, variables = {}) {
  const translation = translations[language];

  if (translation && translation[text]) {
    let translatedText = translation[text];

    // Remplace les variables dans le texte traduit
    Object.keys(variables).forEach((variable) => {
      const value = variables[variable];
      translatedText = translatedText.replace(`{{${variable}}}`, value);
    });
    return translatedText;
  }

  return text;
}

module.exports = {
  loadTranslations,
  translate,
  trans,
};
