'use strict'
const log = require('logger')
const botRequest = require('botrequest')
module.exports = async(discordId)=>{
  try{
    let res = []
    let guilds = await botRequest('getMemberGuilds', {podName: 'all', dId: discordId})
    if(guilds?.length > 0){
      for(let i in guilds) res = res.concat(guilds[i])
    }
    return res
  }catch(e){
    log.error(e)
  }
}
