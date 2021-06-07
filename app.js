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
        },
        i: {
            describe: "Note important tier",
            type: 'boolean'
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body, argv.i);
    }
});

// Create remove command
yargs.command({
    command: "remove",
    describe: "Remove a note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.removeNote(argv.title);
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
        notes.listAll();
    }
});


// Create read command
yargs.command({
    command: "read",
    describe: "Read a note",
    handler(argv) {
        notes.read(argv.title);
    }
});

yargs.command({
    command: "swap",
    describe: "Swap positions between two notes",
    handler(argv) {
        notes.swap(argv._[1], argv._[2], argv.i);
    }
});

yargs.parse();