const fs = require("fs");
const chalk = require("chalk");

const getNotes = function() {
    return "Your notes..."
}

const addNote = function(title, body) {
    const notes = loadNotes();

    const duplicateNotes = notes.some(n => n.title === title);

    if (!duplicateNotes) {
        notes.push({title, body});
        saveNotes(notes);
        console.log(chalk.bgGreen.black("New note added!"));
    } else {
        console.log(chalk.bgRed.black("Note title taken!"));
    }
}

const removeNote = function(title) {
    const notes = loadNotes();

    const notesToKeep = notes.filter(n => n.title !== title);

    if (notesToKeep.length < notes.length) {
        saveNotes(notesToKeep);
        console.log(chalk.bgGreen.black("Note has been removed successfully!"));
    } else {
        console.log(chalk.bgRed.black("There is no note with that title!"));
    }
}

const listNotes = function() {
    const notes = loadNotes();

    console.log(chalk.bgBlueBright.black("Your notes:"));

    if (notes.length !== 0) {
        for (let i = 0; i < notes.length; i++)
            console.log(chalk.blueBright(`Note ${i+1}: `) + notes[i].title);
    } else {
        console.log(chalk.bgBlueBright.black("There are no notes to show! Add one using the 'add' command!"));
    }
}

const read = function(title) {
    const notes = loadNotes();

    for(let i = 0; i < notes.length; i++) {
        if (notes[i].title === title) {
            console.log(chalk.blueBright(`▼ Note ${i+1}: `) + notes[i].title);
            console.log(chalk.yellow(`[Body]\n`) , notes.find(n => n.title === title).body);
            console.log(chalk.yellow(`--------------------------------------------------`));
            return
        }
    }
    console.log(chalk.bgRed.black("The note were you're looking for doesn't exist!"));
}

const listAll = function() {
    const notes = loadNotes();

    console.log(chalk.bgBlueBright.black("Your notes:"));

    if (notes.length !== 0) {
        notes.forEach(n => read(n.title));
    } else {
        console.log(chalk.bgBlueBright.black("There are no notes to show! Add one using the 'add' command!"));
    }
}

const swap = function(from, to) {
    const notes = loadNotes();

    if (typeof from === "number" && typeof to === "number") {

        // Transform to zero indexation
        from--;
        to--;

        // Check index sanity
        let check = "";
        if (notes[from] === undefined) check += chalk.bgRed.black(`The note ${from+1} doesn't exist. `);
        if (notes[to] === undefined) check += chalk.bgRed.black(`The note ${to+1} doesn't exist.`);

        // After sanity index parameters, swap notes
        if (!check) {
            let aux = notes[to];
            notes[to] = notes[from];
            notes[from] = aux;
            saveNotes(notes);
            check += chalk.bgGreen.black(`The note ${from+1} was swapped by note ${to+1} successfully!`);
        }

        console.log(check);

    } else {
        console.log(chalk.bgRed.black("Use tip: you must to put 'swap' followed by two numbers separated between them."));
    }
}








function loadNotes() {
    try {
        const dataBuffer = fs.readFileSync("notes.json");

        const dataJSON = dataBuffer.toString();

        return JSON.parse(dataJSON);
    } catch (e) {
        return []
    }
}

function saveNotes(notes) {
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync("notes.json", dataJSON);
}

module.exports = {
    getNotes,
    addNote,
    removeNote,
    listNotes,
    listAll,
    read,
    swap
}
