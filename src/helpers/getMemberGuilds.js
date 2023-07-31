'use strict'
module.exports = async(discordId)=>{
  try{
    let res = []
    const guilds = await BotSocket.call('botInfo', {shard: 'all', dId: discordId}, 'memberGuilds')
    if(guilds && guilds.length > 0){
      for(let i in guilds){
        res = res.concat(guilds[i])
      }
    }
    return res
  }catch(e){
    console.error(e)
  }
}
