/* eslint-disable no-useless-escape */
const bot = require('../index');

module.exports.generator = async (msg, args) => {
	
	if(args.length < 2) return msg.channel.createMessage('Please provide a user and an amount of funds.');

	let user = resolveMember(args[0], msg.channel.guild);
	if(!user) return msg.channel.createMessage('i cant find that user.');
	// let amount = args[1];
	let amount;
	if(!args[1].toLowerCase().endsWith('m')){
		amount = parseInt(args[1]);
	}else {
		// 
		// amount = args[1].split('').pop().join('');
		let temp = args[1].split('');
		temp.pop();
		amount = parseInt(temp.join(''));
	}

	let settings = await bot.db.settings.findOne({});
	if(!settings || !settings.setup) return msg.channel.createMessage('Bot settings not found, run setup command first.');

	let rewardRoles = settings.rewardRoles;
	let wallet = await bot.db.users.findOne({id: user.id});
	if(!wallet){
		await bot.db.users.insert({id: user.id, amount: amount});
		await enSureRewardRoles(rewardRoles, user);
		return msg.channel.createMessage('Succesfully added funds.');
	}else{
		await bot.db.users.update({id: user.id}, { $inc: {amount: amount} }, {});
		await enSureRewardRoles(rewardRoles, user, wallet);
		return msg.channel.createMessage('Succesfully added funds.');
	}
};
function resolveMember(string, guild){
	let member = guild.members.get(string) || guild.members.find(member => `<@!${member.id}>` === string || `<@${member.id}>` === string) || guild.members.find(member => member.username === string);

	return member;
}
async function enSureRewardRoles(rewardRoles, member){
	let userWallet = await bot.db.users.findOne({id : member.id});

	for(const rewardRole of rewardRoles){
		if( userWallet.amount < rewardRole.amount || member.roles.includes(rewardRole.id) ) continue;
		await member.addRole(rewardRole.id);
		// console.log('gave them role because ', rewardRole);
		continue;
	}
	return;
}
module.exports.options = {
	name: 'add',
	description: 'Adds money to a user\'s wallet.',
	enabled: true,
	fullDescription:'Add funds to a user\'s wallet',
	usage:'add user 10M',
	guildOnly: true,
	aliases: ['paid', 'p', 'a'],
	requirements: {
		userIDs: ['452179067974975489', '143414786913206272']
	}
};