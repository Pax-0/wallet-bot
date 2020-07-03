const bot = require('../index.js');

module.exports.generator = async (msg) => {
	let searchRoles = [{name: 'sapphire', amount: 1}, {name: 'emerald', amount: 100}, {name: 'ruby', amount: 250}, {name: 'diamond', amount: 500},{name: 'dragonstone', amount: 1000}];
	let settings = await bot.db.settings.find({});

	let found = [];
	if(!settings) return msg.channel.createMessage('Bot settings not found.');
	
	for(const searchRole of searchRoles){
		let targetRole = msg.channel.guild.roles.find(role => role.name.toLowerCase() === searchRole.name);
		if(!targetRole) continue;
		found.push(targetRole.name);
		await bot.db.settings.update({}, { $addToSet: {  rewardRoles: {name: searchRole.name, id: targetRole.id, amount: searchRole.amount} } });
		await bot.db.settings.update({}, { $set: {  setup: true } });
	}
	return msg.channel.createMessage('Bot setup! \nReward Roles found: ' + found.join(', '));
};

module.exports.options = {
	name: 'setup',
	description: 'Sets the bot up',
	enabled: true,
	aliases: ['start', 'enable'],
	fullDescription:'starts the bot setup.',
	usage:'',
	guildOnly: true,
	requirements: {
		userIDs: ['517012288071401476', '143414786913206272']
	}
};