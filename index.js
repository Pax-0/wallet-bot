const fs = require('fs');
const eris = require('eris');
const Datastore = require('nedb-promises');
const {token} = require('./config.json');

const clientOptions = {
	autoreconnect: true,
	restMode: true,
	ignoreBots: true,
	ignoreSelf: true
};
// db call here for prefix.
const commandOptions = {
	description: 'a log for attatchments.',
	name: 'attatchment-log',
	owner: 'Uproar',
	prefix: ['@mention', '!'],
};

const bot = new eris.CommandClient(token, clientOptions, commandOptions);


bot.on('ready', async () => { // When the bot is ready
	console.log(`Logged is as ${bot.user.username}!`); // Log "Ready!"
	await loadCommands('./commands');
	await loadEvents('./events');
	await loadDB(bot);
	// await checkDBSettings(bot);
	console.log('Ready!'); // Log "Ready!"
	let doc = await bot.db.users.findOne({});
	console.log(doc); 
});

async function loadDB(bot){
	const usersStore = Datastore.create('./data/users.db');
	bot.db = {
		users: usersStore
	};
	
	await bot.db.users.load();
	return console.log('Connected to DB!');
}

async function loadEvents(dir){
	let events = await fs.readdirSync(dir);
	if(!events.length) return console.log('No events found!');

	for(const eventFile of events){
		let event = require(`./events/${eventFile}`);

		if (event.enabled) {
			bot[event.once ? 'once' : 'on'](event.event, event.handler);
			console.log('Loaded handler for ' + event.event);
		}
	}
}
async function loadCommands(dir){
	let commands = await fs.readdirSync(dir);
	if(!commands.length) return console.log('Error: no commands found.');
	for(const commandFile of commands){
		let command = require(`./commands/${commandFile}`);
		if(command.options.enabled && command.options.hasSubCommands && command.options.subCommands.length ){
			console.log(`loading parent command: ${command.options.name}`);
			let parent = await bot.registerCommand(command.options.name, command.generator, command.options);
			command.options.subCommands.forEach(async element => {
				let subcmd = require(`./commands/${command.options.name}_${element}`);
				await parent.registerSubcommand(element, subcmd.generator, subcmd.options);    
				console.log(`loading sub command: ${subcmd.options.name} of ${parent.label}`);
			});
		}
		else if(command.options.enabled && !command.options.isSubCommand){
			console.log(`loading command: ${command.options.name}`);
			await bot.registerCommand(command.options.name, command.generator, command.options);
		}
	}
}

bot.connect();

module.exports = bot;
