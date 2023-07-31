'use strict'
const log = require('logger')
const botRequest = require('botrequest')
module.exports = async()=>{
  try{
    let res = await botRequest('botGuilds', {podName: 'all'})
    return res
  }catch(e){
    log.info(e)
  }
}
