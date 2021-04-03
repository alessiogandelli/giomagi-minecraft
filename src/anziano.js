const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const autoeat = require('mineflayer-auto-eat')
const vec3 = require('vec3')
const toolPlugin = require('mineflayer-tool').plugin

const RANGE_GOAL = 1

const bot = mineflayer.createBot({
    host: '192.168.1.210', // optional
    username: 'anziano', // email and password are required only for
    // online-mode=true servers
    version: false,                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})

bot.once('spawn', () => {
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    const RANGE_GOAL = 1

    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        if (message !== 'cum') return

        const target = bot.players[username]?.entity
        if (!target) {
            bot.chat("I don't see you !")
            return
        }
        const { x: playerX, y: playerY, z: playerZ } = target.position

        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL))
    })
})