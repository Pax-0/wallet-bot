const bot = require('../index');

module.exports.generator = async (msg, args) => {

	const settings = await bot.db.settings.findOne({});
	if(!settings || !settings.setup) return msg.channel.createMessage('bot settings not found.');

	if(args.length){
		// get another user's wallt
		let user = resolveMember(args.join(' '), msg.channel.guild);
		if(!user) return msg.channel.createMessage('i cant find that user.');

		let wallet = await bot.db.users.findOne({id: user.id});
		if(!wallet){
			let embed = makeEmbed(0, user);
			return msg.channel.createMessage({embed: embed});	
		}

		// embed for wallet.amount here
		let embed = makeEmbed(wallet.amount, user);
		return msg.channel.createMessage({embed: embed});
	}else{
		// get your own wallet value

		let wallet = await bot.db.users.findOne({id: msg.author.id});
		if(!wallet){
			let embed = makeEmbed(0, msg.author);
			return msg.channel.createMessage({embed: embed});	
		}

		// embed for wallet.amount here
		let embed = makeEmbed(wallet.amount, msg.author);
		return msg.channel.createMessage({embed: embed});
	}
};
function resolveMember(string, guild){
	let member = guild.members.get(string) || guild.members.find(member => `<@!${member.id}>` === string || `<@${member.id}>` === string) || guild.members.find(member => member.username === string);

	return member;
}
function makeEmbed(amount, user){
	const embed = {
		author: {
			name: user.username,
			icon_url: user.avatarURL
		},
		title: 'Amount spent in GoldHouse.',
		footer: {
			text: `Amount: ${amount}M`,
		}
	};
	return embed;
}
module.exports.options = {
	name: 'wallet',
	description: 'Check a user\'s wallet or your own.',
	enabled: true,
	aliases: ['w'],
	fullDescription:'Get the wallet value of your account or another user\'s',
	usage:'',
	guildOnly: true,
};