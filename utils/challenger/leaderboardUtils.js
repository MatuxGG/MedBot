const fetch = require('node-fetch');
const FormData = require('form-data');
const { PLAYER_INFO_API_URL, LEADERBOARD_API_URL } = require('../../config');

module.exports.getPlayerData = async function (userIds){
    const form = new FormData();
    form.append('token', process.env.LEADERBOARD_API_TOKEN);
    form.append('players', "[" + userIds.join(", ").toString() + "]");

    let res = await fetch(PLAYER_INFO_API_URL, {
        method: 'POST',
        body: form
    });

    return await res.json();
}

module.exports.getLeaderboardData = async function (onlyDiscord){
    const form = new FormData();
    form.append('token', process.env.LEADERBOARD_API_TOKEN);
    form.append('playersCount', 10);
    form.append('onlyDiscord', onlyDiscord);

    let res = await fetch(LEADERBOARD_API_URL, {
        method: 'POST',
        body: form
    });

    return await res.json();
}