const fs = require("fs");
const chalk = require("chalk");

const getNotes = function() {
    return "Your notes..."
}

const addNote = function(title, body, important) {
    const notes = loadNotes();

    const importantNotes = notes.filter(n => n.important);
    const commonNotes = notes.filter(n => !n.important);

    const duplicateNotes = notes.some(n => n.title === title);

    if (!duplicateNotes) {
        if (important) {
            importantNotes.push({title, body, important})
        } else {
            commonNotes.push({title, body, important});
        }

        saveNotes(importantNotes.concat(commonNotes));

        console.log(chalk.bgGreen.black(`New ${important? "important" : "common"} note added!`));

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

    if (notes.length !== 0) {

        // Important notes management
        console.log(chalk.bgRedBright.black("Your important notes:"));
        const importantNotes = notes.filter(n => n.important);
        for (let i = 0; i < importantNotes.length; i++) {
            console.log(chalk.redBright(`Note ${i+1}: `) + importantNotes[i].title);
        }

        // Common notes management
        console.log(chalk.bgBlueBright.black("Your common notes:"));
        const commonNotes = notes.filter(n => !n.important);
        for (let i = 0; i < commonNotes.length; i++) {
            console.log(chalk.blueBright(`Note ${i+1}: `) + commonNotes[i].title);
        }

    } else {
        console.log(chalk.bgBlueBright.black("There are no notes to show! Add one using the 'add' command!"));
    }
}

const read = function(title) {
    const notes = loadNotes();

    const importantNotes = notes.filter(n => n.important);

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].title === title) {
            if (notes[i].important) {
                console.log(chalk.redBright(`▼ Note ${i+1}: `) + notes[i].title);
            } else {
                console.log(chalk.blueBright(`▼ Note ${i + 1 - importantNotes.length}: `) + notes[i].title);
            }
            console.log(chalk.yellow(`[Body]\n`) , notes.find(n => n.title === title).body);
            console.log(chalk.yellow(`--------------------------------------------------`));
            return
        }
    }
    console.log(chalk.bgRed.black("The note were you're looking for doesn't exist!"));
}

const listAll = function() {
    const notes = loadNotes();

    const importantNotes = notes.filter(n => n.important);
    const commonNotes = notes.filter(n => !n.important);

    if (notes.length !== 0) {
        console.log(chalk.bgRedBright.black("Your important notes:"));
        importantNotes.forEach(n => read(n.title));
        console.log(chalk.bgBlueBright.black("Your common notes:"));
        commonNotes.forEach(n => read(n.title));
    } else {
        console.log(chalk.bgBlueBright.black("There are no notes to show! Add one using the 'add' command!"));
    }
}

const swap = function(from, to, important) {
    const notes = loadNotes();

    if (typeof from === "number" && typeof to === "number") {

        const amountImportantNotes = notes.filter(n => n.important).length;

        // Transform to zero indexation
        if (!important) {
            from += amountImportantNotes;
            to += amountImportantNotes;
        }
        from--;
        to--;

        // Check index sanity
        let check = "";
        if (notes[from] === undefined) check += chalk.bgRed.black(`The ${important? "important" : "common"} note ${from+1} doesn't exist. `);
        if (notes[to] === undefined) check += chalk.bgRed.black(`The ${important? "important" : "common"} note ${to+1} doesn't exist.`);

        // After sanity index parameters, swap notes
        if (!check) {

            let aux = notes[to];
            notes[to] = notes[from];
            notes[from] = aux;

            saveNotes(notes);

            check += chalk.bgGreen.black(   // Setting console message
                `The ${
                    important? "important" : "common"
                } note ${
                    important? from+1 : from+1-amountImportantNotes
                } was swapped by note ${
                    important? to+1 : to+1-amountImportantNotes
                } successfully!`
            );
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
