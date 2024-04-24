const { Guild } = require('../../models/index');

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {

        Guild.countDocuments({id: guild.id}, function (err, count){ 
            if(count<=0){
                const createGuild = new Guild({ id: guild.id });
                createGuild.save().then(g => console.log(`New server : ${g.id}`));
            }
        }); 
        
    }
}