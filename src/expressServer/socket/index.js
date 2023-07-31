'use strict'
const log = require('logger')
const { Server } = require('socket.io')
const Cmds = require('./cmds')

module.exports = async(server)=>{
  try{
    const io = new Server(server, {maxHttpBufferSize: 1e8})
    io.on('connection', (socket)=>{
      socket.on('disconnect', (reason)=>{
        log.debug(socket.id+' disconnected because of '+reason)
      })
      socket.on('connect', ()=>{
        log.debug(socket.id+' connected')
      })
      socket.on('cmd', async(cmd, data = {})=>{
        try{
          if(!data.discordId) return
          let dId = await HP.DecryptId(data.discordId)
          if(!dId) return
          if(Cmds[cmd]) Cmds[cmd](socket, data, dId)
        }catch(e){
          log.info(e)
        }
      })
    })
  }catch(e){
    log.error(e);
  }
}
