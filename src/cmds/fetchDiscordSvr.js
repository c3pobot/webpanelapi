'use strict'

module.exports = async(obj = {}, discordId)=>{
  try{
    let dObj, res = {status: {openAlert: true, type:'error', msg: 'Error getting data from the bot'}}, updateAllowed = 1
    if(discordId) dObj = (await mongo.find('discordId', {_id: discordId}))[0]

    if(dObj && discordId != process.env.BOT_OWNER_ID){
      const cached = (await mongo.find('webPanelCache', {_id: discordId}))[0]
      if(cached && cached.updated && !obj.forced){
        const timeNow = Date.now()
        const timeDiff = +timeNow - +cached.updated
        if( timeDiff < 120000){
          updateAllowed = 0
          res.status.msg = 'You have '+Math.floor((120000 - +timeDiff) / 1000)+' seconds until you can refresh again'
        }
      }
    }

    if(dObj && updateAllowed){
      const data = {
        botOwner: false,
        guilds: [],
        servers: []
      }

      let botGuilds = await HP.GetMemberGuilds(discordId)
      if(discordId == process.env.BOT_OWNER_ID){
        data.botOwner = true
      }
      if(botGuilds?.length > 0){
        for(let i in botGuilds){
          const tempObj = {
            id: botGuilds[i].id,
            name: botGuilds[i].name,
            owner: (botGuilds[i].ownerID === discordId ? true:false),
            admin: false
          }
          if(botGuilds[i].roles?.length > 0){
            const guild = (await mongo.find('discordServer', {_id: botGuilds[i].id}, {admin: 1}))[0]
            if(guild?.admin?.length > 0 && guild.admin.some(x=> botGuilds[i].roles.includes(x.id))) tempObj.admin = true
          }
          data.servers.push(tempObj)
        }
      }
      if(dObj && dObj.allyCodes && dObj.allyCodes.length > 0){
        for(let i in dObj.allyCodes){
          if(dObj.allyCodes[i].allyCode){
            const player = await Client.post('player', {allyCode: dObj.allyCodes[i].allyCode.toString()})
            if(player && player.guildId){
              if(data.guilds.filter(x=>x.id === player.guildId).length == 0){
                const gObj = {
                  id: player.guildId,
                  name: player.guildName,
                  admin: false
                }
                const gameGuild = (await mongo.find('guilds', {_id: player.guildId}, {sId: 1}))[0]
                gObj.admin = ((gameGuild && gameGuild.sId && data.servers.filter(x=>x.id === gameGuild.sId && x.admin == true).length > 0) ? true:false)
                data.guilds.push(gObj)
              }
            }
          }
        }
      }
      await mongo.set('webPanelCache', {_id: discordId}, {updated: Date.now()})
      res.status = {openAlert: true, type:'success', msg: 'Discord Server data updated'}
      res.data = data
    }
    return res
  }catch(e){
    console.error(e)
    return {status: {openAlert: true, type:'error', msg: 'Error getting data from the bot'}}
  }
}
