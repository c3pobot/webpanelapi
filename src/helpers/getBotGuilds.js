'use strict'
const log = require('logger')
const botRequest = require('./botRequest')
const mongo = require('mongoclient')
module.exports = async()=>{
  let res = (await mongo.find('webPanelAdminCache', {_id: 'botGuilds'}))[0]
  if(res?.data) return res.data
  res = []
  let guilds = await botRequest('botGuilds', { podName: 'all' })
  if(guilds){
    for(let i in guilds) res = res.concat(guilds[i]);
  }
  if(res?.length > 0) mongo.set('webPanelAdminCache', {_id: 'botGuilds'}, { data: res })
  return res
}
