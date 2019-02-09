const pg=require('pg')
const Discord=require('discord.js')


module.exports.CSRBan=function (client,db,usr,callback){
            db.query(`INSERT OR REPLACE INTO banned (id) VALUES (?)`,[usr.id],function(err){
                if(err){
                    // message.channel.send(`error adding to DB[${err}]`)
                    callback(err)
                }
                else{
                    client.banlist.push(usr.id)
                    callback()
                    
                   // message.channel.send(`Boi ${banee.username} you have been temp banned for ${ms(ms(time),{long:true})}`) 
                }
            })
}

/**
 * @param {sqlite.DB} db database
 * @param {Discord.User} usr user
 * @param {function} callback()
 */
module.exports.CSRUnban=function (client,db,usr,callback){
    db.query(`DELETE FROM banned WHERE id = ${usr.id}`,(res,err)=>{
        if(err){
            //message.channel.send(`DB error[${err}]`)
            callback()
        }
        else{
            client.banlist.splice(client.banlist.findIndex(x=>x==usr.id),1)
            callback()
        }
        });
}