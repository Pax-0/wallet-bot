module.exports.generator = async (msg, args) => {
	// temp command file.
	return console.log(msg.content, args);
};

module.exports.options = {
	name: 'setup',
	description: 'Sets the bot up',
	enabled: true,
	aliases: ['start', 'enable'],
	fullDescription:'starts the bot setup.',
	usage:'',
	argsRequired: true,
	guildOnly: true,
	requirements: {
		userIDs: ['517012288071401476', '143414786913206272']
	}
};