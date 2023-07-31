'use strict'
module.exports = async()=>{
  try{
    let res = []
    const guilds = await BotSocket.call('botInfo', {shard: 'all'}, 'botGuilds')
    if(guilds && guilds.length > 0){
      for(let i in guilds) res = res.concat(guilds[i])
    }
    return res
  }catch(e){
    console.log(e)
  }
}
