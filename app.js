const chalk = require("chalk");
const yargs  = require("yargs");
const notes = require("./notes");

// Customize yargs version
yargs.version("0.1.0");

// Create add command
yargs.command({
    command: "add",
    describe: "--------------------------------------------------------------\n" +
        "Allows you to add a new note.\n" +
        `It ${chalk.greenBright.underline("requires")} a title and body for the note.\n` +
        "Set the flag '-i' to add a note to the important list.",
    builder: {
        title: {
            describe: `Use ${chalk.redBright("--title=\"TITLE\"")} to provide a title.`,
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: `Use ${chalk.redBright("--body=\"BODY\"")} to provide a body.`,
            demandOption: true,
            type: 'string'
        },
        i: {
            describe: "Set this flag, to add a note to the important list.",
            type: 'boolean'
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body, argv.i || false);
    }
});

// Create remove command
yargs.command({
    command: "remove",
    describe: "--------------------------------------------------------------\n" +
        "Provide the number of the note you want to remove.\n" +
        "You can provide a set of numbers to delete multiples notes simultaneously.\n" +
        "Set the flag '-i' to remove your important notes.\n",
    handler(argv) {
        notes.removeNote(argv._.slice(1), argv.i ||false);
    }
});

// Create list command
yargs.command({
    command: "list",
    aliases: "l",
    describe: "--------------------------------------------------------------\n" +
        "List just the title of your notes.\n",
    handler() {
        notes.listNotes();
    }
});


// Create listall command
yargs.command({
    command: "listall",
    aliases: "la",
    describe: "--------------------------------------------------------------\n" +
        "List all notes including their titles and bodies.\n",
    handler() {
        notes.listAllNotes();
    }
});


// Create read command
yargs.command({
    command: "read",
    describe: "--------------------------------------------------------------\n" +
        "Provide the number of the note you want to read.\n" +
        "You can provide a set of numbers to read multiples notes simultaneously.\n" +
        "Set the flag '-i' to read your important notes.\n",
    handler(argv) {
        notes.readNote(argv._.slice(1), argv.i || false);
    }
});

yargs.command({
    command: "swap",
    describe: "--------------------------------------------------------------\n" +
        "Provide two numbers (if there are more, ignore the rest) of notes to swap position on the list.\n" +
        "Set the flag '-i' to swap your important notes.\n",
    handler(argv) {
        notes.swapNotes(argv._[1], argv._[2], argv.i || false);
    }
});

yargs.parse();

// commit -m "Provides more verbose description of command's functionality in the 'help' area."