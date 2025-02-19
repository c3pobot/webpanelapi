'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const rabbitmq = require('./rabbitmq')
const swgohClient = require('./swgohClient')
require('./exchange')

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
const CheckRabbitMQ = ()=>{
  try{
    if(!rabbitmq?.status) log.debug(`rabbitmq is not ready...`)
    if(rabbitmq?.status){
      log.debug(`rabbitmq is ready...`)
      rabbitmq.notify({ cmd: 'requestNumBotShards' })
      CheckBot()
      return
    }
    setTimeout(CheckRabbitMQ, 5000)
  }catch(e){
    log.error(e)
    setTimeout(CheckRabbitMQ, 5000)
  }
}
const CheckApiReady = async()=>{
  try{
    let obj = await swgohClient('metadata')
    if(obj?.latestGamedataVersion){
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
  require('./express')
}
CheckMongo()
