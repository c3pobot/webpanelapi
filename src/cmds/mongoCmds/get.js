'use strict'
const log = require('logger')
const mongo = require('mongoclient')

module.exports = async(obj = {})=>{
  try{
    let res = []
    if(obj.collection) res = await mongo.find(obj.collection, obj.query || {}, obj.projection || null)
    return res
  }catch(e){
    log.error(e)
    return []
  }
}
