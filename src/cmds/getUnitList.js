'use strict'
const log = require('logger')
const mongo = require('mongoclient')

module.exports = async(obj = {}, dId)=>{
  let dObj = (await mongo.find('discordId', {_id: dId}))[0]
  if(!dObj?.allyCodes || dObj?.allyCodes?.length == 0) return { msg: { type: 'error', msg: 'Your discrod account is not linked to the bot' } }
  return await mongo.find('units', {}, { portrait: 0, thumbnail: 0 })
}
