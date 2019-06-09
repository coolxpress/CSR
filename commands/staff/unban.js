const dmap = require('dmap-postgres');
const csr = require('../../banfuncs.js');
const { Command } = require('easy-djs-commandhandler');
const unban = new Command({ name: 'unban', hideinhelp:true  });
module.exports = unban.execute(async (client, message, args) => {
	const db = new dmap('data', {
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	});
	await db.connect();
	if (!message.client.staff.has(message.author.id)) {
		message.channel.send('no permission');
		return;
	}
	const banee =
		message.mentions.users.first() ||
		message.client.users.get(args[0]) ||
		message.client.users.find(x => x.tag == args.join(' ')) ||
		message.client.users.find(x => x.username == args.join(' '));
	if (!banee) {
		return await db.end();
	}
	await csr.CSRUnban(message.client, banee, db);
	message.channel.send('removed from DB');
	await db.end();
});
