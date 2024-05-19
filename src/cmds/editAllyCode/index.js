'use stict'
const Cmds = {}
Cmds.remove = require('./remove')
Cmds.removeAuth = require('./removeAuth')
module.exports = async(obj = {}, dId)=>{
  if(obj.method && Cmds[obj.method]) return await Cmds[obj.method](obj, dId)
}
