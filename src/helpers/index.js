'use strict'
const swgohhelper = require('swgohhelper')
const Cmds = swgohhelper
Cmds.EncryptId = require('./encryptId')
Cmds.CleanAllyCodes = require('./cleanAllyCodes')
Cmds.DecryptId = require('./decryptId')
Cmds.GetBotGuilds = require('./getBotGuilds')
Cmds.GetMemberGuilds = require('./getMemberGuilds')
Cmds.GetUnitCheck = require('./getUnitCheck')
Cmds.VerifyUnit = require('./verifyUnit')
Cmds.updateUnitImage = require('./updateUnitImage')
module.exports = Cmds
