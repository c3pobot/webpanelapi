'use strict'
const QueryGuild = async(guildId)=>{
  try{
    let guild = (await mongo.find('guildCache', {_id: guildId}))[0]
    if(!guild){
      let tempGuild = await Client.post('guild', {guildId: guildId, includeRecentGuildActivityInfo: false} )
      if(tempGuild?.guild?.profile){
        guild = tempGuild.guild
        guild.updated = Date.now()
        guild.id = guild.profile.id
        guild.name = guild.profile.name
      }
    }
    if(guild.member) guild.member = guild.member.filter(x=>x.memberLevel !== 1)
    return guild
  }catch(e){
    console.error(e);
  }
}

module.exports = async(socket, data = {}, dId)=>{
  try{
    let guild, members = []
    if(data?.guildId) guild = await QueryGuild(data.guildId)
    if(guild?.member?.length > 0) socket.emit('guild', guild)
  }catch(e){
    console.error(e);
  }
}
