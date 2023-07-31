'use strict'
require('./globals')
require('./expressServer')
const InitRedis = async()=>{
  try{
    await redis.init()
    const redisStatus = await redis.ping()
    if(redisStatus == 'PONG'){
      console.log('redis connection successful...')
      CheckMongo()
    }else{
      console.log('redis connection error. Will try again in 5 seconds...')
      setTimeout(InitRedis, 5000)
    }
  }catch(e){
    console.error('redis connection error. Will try again in 5 seconds...')
    setTimeout(InitRedis, 5000)
  }
}
const CheckMongo = async()=>{
  const status = await mongo.init();
  if(status > 0){
    console.log('Mongo connection successful on webLinkSocket')
    await GetData()
    await CheckAPIReady()
    UpdateData()
  }else{
    console.log('Mongo error on webLinkSocket. Will try again in 5 seconds')
    setTimeout(()=>CheckMongo(), 5000)
  }
}
const CheckAPIReady = async()=>{
  const obj = await Client.post('metadata')
  if(obj?.latestGamedataVersion){
    console.log('API is ready ..')
    apiReady = 1
  }else{
    console.log('API is not ready. Will try again in 5 seconds')
    setTimeout(()=>CheckAPIReady(), 5000)
  }
}
process.on('unhandledRejection', (error) => {
  console.error(error)
});
const GetData = async()=>{
  try{
    const tempMeta = (await mongo.find('metaData', {_id: 'config'}, {data: 1}))[0]?.data
    if(tempMeta?.length > 0) metaConfig = tempMeta
    const tempDef = await mongo.find('modsDef', {}, {_id: 0})
    if(tempDef?.length > 0) modDefData = tempDef
    const obj = (await mongo.find('botSettings', {_id: 'gameData'}))[0]
    if(obj?.version !== gameVersion && obj?.data){
      console.log('Setting new gameData to '+obj.version)
      gameVersion = obj.version;
      gameData = obj.data
      //HP.UpdateUnitsList()
    }
  }catch(e){
    console.error(e);
  }
}
const UpdateData = async()=>{
  await GetData()
  setTimeout(()=>UpdateData(), 300000)
}
InitRedis()
