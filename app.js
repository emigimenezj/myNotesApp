const yargs  = require("yargs");
const notes = require("./notes");

// Customize yargs version
yargs.version("0.1.0");

// Create add command
yargs.command({
    command: "add",
    describe: "Add a new note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: "Note body",
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body);
    }
});

// Create remove command
yargs.command({
    command: "remove",
    describe: "Remove a note",
    handler(argv) {
        notes.removeNote(argv._.slice(1));
    }
});

// Create list command
yargs.command({
    command: "list",
    describe: "List your notes",
    handler() {
        notes.listNotes();
    }
});


// Create listall command
yargs.command({
    command: "listall",
    describe: "List all notes with their bodies",
    handler() {
        notes.listAllNotes();
    }
});


// Create read command
yargs.command({
    command: "read",
    describe: "Read a note",
    handler(argv) {
        notes.readNote(argv._.slice(1));
    }
});

yargs.command({
    command: "swap",
    describe: "Swap positions between two notes",
    handler(argv) {
        notes.swapNotes(argv._[1], argv._[2]);
    }
});

yargs.parse();