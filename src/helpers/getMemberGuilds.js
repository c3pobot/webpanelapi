'use strict'
const log = require('logger')
const botRequest = require('./botRequest')
module.exports = async(discordId)=>{
  let res = []
  let guilds = await botRequest('getMemberGuilds', { podName: 'all', dId: discordId })
  if(guilds?.length > 0){
    for(let i in guilds) res = res.concat(guilds[i])
  }
  return res
}
