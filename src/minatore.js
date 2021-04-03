
const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const autoeat = require('mineflayer-auto-eat')
const vec3 = require('vec3')
const toolPlugin = require('mineflayer-tool').plugin

const RANGE_GOAL = 1

const bot = mineflayer.createBot({
    host: '192.168.1.210', // optional
    username: 'giomagi', // email and password are required only for
    // online-mode=true servers
    version: false,                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(autoeat)
bot.loadPlugin(toolPlugin)


//seguimi se scrivo cum 
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

//autoeat and selcect correct tool
bot.once('spawn', () => {
    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 14,
        bannedFood: []
    }
    dig()

})

bot.on('autoeat_started', () => {
    console.log('Auto Eat started!')
})

bot.on('autoeat_stopped', () => {
    console.log('Auto Eat stopped!')
})

bot.on('health', () => {
    if (bot.food === 20) bot.autoEat.disable()
    else bot.autoEat.enable()
})

//quando hai finito di minare un blocco
bot.on('diggingCompleted', () => {
    dig()
})


bot.on('chat', function (username, message) {

    if (message == 'day')
        bot.chat('Day' + ' ' + bot.time.day);

    else if (message === 'nanna')
        goToSleep()


    else if (message === 'ora')
        orario()

    else if (message === 'dig') {
        bot.pathfinder.setGoal(new GoalNear(160, 63, 180, 1))
        dig()
    }

    else if (message === 'help')
        bot.chat('day, nanna, lavoro, ora, dig')


    if (username === bot.username) return

})



function orario() {
    const time = ((bot.time.timeOfDay + 6000));
    const hour = parseInt(time / 1000)
    const min = parseInt((time % 1000) / 16.66666);
    console.log(min)
    bot.chat(hour + ':' + min);
}

async function goToSleep() {
    const bed = bot.findBlock({
        matching: block => bot.isABed(block)
    })
    if (bed) {
        try {
            await bot.sleep(bed)
            bot.chat("si dorme")
        } catch (err) {
            bot.chat(`I can't sleep: ${err.message}`)
        }
    } else {
        bot.chat('No nearby bed')
    }
}

// function dig() {
//     let x = 160
//     let y = 65
//     let z = 182
//     let offset = 0

//     let target = bot.blockAt(new vec3(x,y,z))
//     console.log(target.name)

//     while(target.name != 'stone'){ 
//         target = bot.blockAt(new vec3(x,y,z+ offset))
//         offset = (offset+ 1) % 5
//     }  


//     if (bot.targetDigBlock) {
//         bot.chat(`already digging ${bot.targetDigBlock.name}`)
//     } else {

//             if (target && bot.canDigBlock(target)) {
//                 bot.chat(`starting to dig ${target.name}`)
//                 bot.dig(target, onDiggingCompleted)
//                 finished = true
//             } else {
//                 bot.chat('cannot dig')
//             }
//         }

//         function onDiggingCompleted (err) {
//             if (err) {
//               console.log(err.stack)
//               return
//             }
//             bot.chat(`finished digging ${target.name}`)
//           }
// }


function dig() {
    let x = 160
    let y = 65
    let z = 182

    let target = bot.blockAt(new vec3(x, y, z))
    if (bot.targetDigBlock) {
        bot.chat(`already digging ${bot.targetDigBlock.name}`)
    }else{
        bot.tool.equipForBlock(target, {}, () => {
        bot.dig(target)
    })  
    }


}

bot.on('wake', () => {
    dig()
}
)




bot.on('rain', () => {
    bot.chat('ma diocane')
}
)