'use strict'
const log = require('logger')
require('./globals')
require('./expressServer')
const InitRedis = async()=>{
  try{
    await redis.init()
    let redisStatus = await redis.ping()
    if(redisStatus == 'PONG'){
      log.info('redis connection successful...')
      await GetData()
      await CheckAPIReady()
      UpdateData()
    }else{
      log.info('redis connection error. Will try again in 5 seconds...')
      setTimeout(InitRedis, 5000)
    }
  }catch(e){
    log.error('redis connection error. Will try again in 5 seconds...')
    setTimeout(InitRedis, 5000)
  }
}
const CheckAPIReady = async()=>{
  let obj = await Client.post('metadata')
  if(obj?.latestGamedataVersion){
    log.info('API is ready ..')
    apiReady = 1
  }else{
    log.info('API is not ready. Will try again in 5 seconds')
    setTimeout(()=>CheckAPIReady(), 5000)
  }
}
const GetData = async()=>{
  try{
    let tempMeta = (await mongo.find('metaData', {_id: 'config'}, {data: 1}))[0]?.data
    if(tempMeta?.length > 0) metaConfig = tempMeta
    let tempDef = await mongo.find('modsDef', {}, {_id: 0})
    if(tempDef?.length > 0) modDefData = tempDef
    let obj = (await mongo.find('botSettings', {_id: 'gameData'}))[0]
    if(obj?.version !== gameVersion && obj?.data){
      log.info('Setting new gameData to '+obj.version)
      gameVersion = obj.version;
      gameData = obj.data
      //HP.UpdateUnitsList()
    }
  }catch(e){
    log.error(e);
  }
}
const UpdateData = async()=>{
  await GetData()
  setTimeout(()=>UpdateData(), 300000)
}
InitRedis()
