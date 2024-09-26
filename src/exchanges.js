'use strict'
const mongo = require('mongoclient')
const log = require('logger')
const rabbitmq = require('./helpers/rabbitmq')

const { setNumShards } = require('./helpers/botRequest/botInfo')

let POD_NAME = process.env.POD_NAME || 'worker', NAME_SPACE = process.env.NAME_SPACE || 'default'
let QUE_NAME = `${NAME_SPACE}.${POD_NAME}.topic`
let SET_EXCHANGE = process.env.BOT_SET_EXCHANGE || 'k8-status'
let SET_ROUTING_KEY = process.env.BOT_SET_TOPIC || `statefulset.${NAME_SPACE}.bot`

let exchanges = [{ exchange: SET_EXCHANGE, type: 'topic'}]
let queueBindings = [{ exchange: SET_EXCHANGE, routingKey: SET_ROUTING_KEY, queue: QUE_NAME }]
let consumer
const cmdProcessor = (msg = {})=>{
  try{
    if(!msg.body || !msg.routingKey) return
    if(msg.routingKey === SET_ROUTING_KEY) setNumShards(msg.body)
  }catch(e){
    log.error(e)
  }
}
const startConsumer = async()=>{
  try{
    let status = mongo.status()
    if(status) status = rabbitmq.ready
    if(!status){
      setTimeout(startConsumer, 5000)
      return
    }
    if(consumer) await consumer.close()
    consumer = rabbitmq.createConsumer({
      consumerTag: POD_NAME,
      queue: QUE_NAME,
      exchanges: exchanges,
      queueBindings: queueBindings,
      queueOptions: { queue: QUE_NAME, durable: false, exclusive: true, arguments: { 'x-message-ttl': 6000 } }
    }, cmdProcessor)
    consumer.on('error', (err)=>{
      log.info(err)
    })
    consumer.on('ready', ()=>{
      log.info(`${POD_NAME} topic consumer created...`)
    })
  }catch(e){
    log.error(e)
    setTimeout(startConsumer, 5000)
  }
}
startConsumer()
