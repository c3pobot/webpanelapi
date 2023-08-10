'use strict'
const log = require('logger')
const redis = require('redisclient')
const mongo = require('mongoclient')
const swgohClient = require('./swgohClient')

const CheckRedis = async()=>{
  try{
    let status = redis.status()
    if(status){
      CheckMongo()
      return
    }
    setTimeout(CheckRedis, 5000)
  }catch(e){
    log.error(e);
    setTimeout(CheckRedis, 5000)
  }
}
const CheckMongo = async()=>{
  try{
    let status = mongo.status()
    if(status){
      CheckApiReady()
      return
    }
    setTimeout(CheckMongo, 5000)
  }catch(e){
    log.error(e);
    setTimeout(CheckMongo, 5000)
  }
}
const CheckApiReady = async()=>{
  try{
    let status = await swgohClient.status()
    if(status){
      StartServices()
      return
    }
    setTimeout(CheckApiReady, 5000)
  }catch(e){
    log.error(e)
    setTimeout(CheckApiReady, 5000)
  }
}
const StartServices = async()=>{
  try{
    require('./expressServer')
  }catch(e){
    log.error(e);
    setTimeout(StartServices, 5000)
  }
}
CheckRedis()
