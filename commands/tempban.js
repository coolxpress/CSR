const pg = require('pg');
const ms = require('ms');
const Csr = require('./banfuncs.js');
const { staff } = require('./stafflist.json');
// const {staff}=require('./stafflist.json')

module.exports = {
	name: 'tempban',
	alias:['tban'],
	staff:'bans an user for a set ammount of time',
	async execute(message, args) {
		const db = new pg.Client({
			connectionString:process.env.DATABASE_URL,
			ssl:true,
		});
		await db.connect();
		if(staff.findIndex(x=>x === message.author.id) == -1) {
			message.channel.send('no permission');
			return;
		}
		const banee = message.mentions.members.first() || message.client.users.get(args[0]);
		args.shift();
		const time = args.shift();
		if(!banee) {
			message.channel.send('who do you expect me to ban?');
			return db.end();
		}
		if(!time) {
			message.channel.send('BOI If you dont choose the time');
			return db.end();
		}
		// let banee=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
		if(banee) {
			await Csr.CSRBan(message.client, db, banee);
			message.channel.send(`Boi <@${banee.id}> you have been temp banned for ${ms(ms(time), { long:true })}`);
			setTimeout(async () => {
				await Csr.CSRUnban(message.client, db, banee);
				message.channel.send(`Unbanned <@${banee.id}>, Ban duration (${ms(time)})`);
				await db.end();
			}, ms(time));
		}

	},

};