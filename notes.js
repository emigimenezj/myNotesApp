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

const removeNote = function(indexs) {
    const notes = loadNotes();

    // Transform to zero indexation
    indexs = indexs.map(i => i - 1);

    if (!indexs.some(i => notes[i] === undefined)) { // Check if there are an invalid index. (out of range or text)

        let notesToKeep = [];

        for (let n in notes)
            if (!indexs.some(i => i == n)) notesToKeep.push(notes[n]);

        saveNotes(notesToKeep);
        console.log(chalk.bgGreen.black("Notes has been removed successfully!"));

    } else {
        console.log(chalk.bgRed.black("Some notes were you're wanting to delete doesn't exist!"));
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

const readNote = function(indexs) {

    const notes = loadNotes();

    // Transform to zero indexation
    indexs = indexs.map(i => i - 1);

    if (!indexs.some(i => notes[i] === undefined)) {
        indexs.map(i => {
            console.log(chalk.blueBright(`▼ Note ${i+1}: `) + notes[i].title);
            console.log(chalk.yellow(`[Body]\n`) , notes[i].body);
            console.log(chalk.yellow(`--------------------------------------------------`));
        })
        return
    }
    console.log(chalk.bgRed.black("Some notes were you're looking for doesn't exist!"));
}

const listAllNotes = function() {
    const notes = loadNotes();

    if (notes.length !== 0) {
        let indexs = [];
        for (let i = 0; i < notes.length; i++) {
            indexs[i] = i+1;    // Use i+1 because "readNote" needs non-zero index array.
        }
        readNote(indexs);
    } else {
        console.log(chalk.bgBlueBright.black("There are no notes to show! Add one using the 'add' command!"));
    }
}

const swapNotes = function(from, to) {
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
    listAllNotes,
    readNote,
    swapNotes
}
