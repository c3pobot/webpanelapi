'use strict'
const log = require('logger')
const botRequest = require('botrequest')
module.exports = async(discordId)=>{
  try{
    let res = await botRequest('memberGuilds', {podName: 'all', dId: discordId})
    return res
  }catch(e){
    log.error(e)
  }
}
