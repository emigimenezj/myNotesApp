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

const removeNote = function(indexs, important) {

    const notes = loadNotes();

    const importantNotes = notes.filter(n => n.important);
    const commonNotes = notes.filter(n => !n.important);

    // Transform to zero indexation
    indexs = indexs.map(i => i - 1);

    const notesWorkWith = important ? importantNotes : commonNotes;
    let notesToKeep = [];

    if (!indexs.some(i => notesWorkWith[i] === undefined)) {
        for (let n = 0; n < notesWorkWith.length; n++) {
            if (!indexs.some(i => i === n)) notesToKeep.push(notesWorkWith[n]);
        }
        notesToKeep = important ? notesToKeep.concat(commonNotes) : importantNotes.concat(notesToKeep);

        // Listing notes to be deleted.
        for (let i = 0; i < notesWorkWith.length; i++) {
            if (!notesToKeep.some(n => n.title === notesWorkWith[i].title)) {
                if (important)
                    console.log(chalk.redBright(`Note ${i + 1}: `) + notesWorkWith[i].title);
                else
                    console.log(chalk.blueBright(`Note ${i + 1}: `) + notesWorkWith[i].title);
            }
        }

        // Warning message before delete notes. (requires user confirmation for deleting notes)
        let answer;
        process.stdout.write("Ey! Are you sure you want to delete the notes listed above? (Y/n)\n");
        process.stdin.on("data", function (str) {
            answer = str.toString().trim();
            if (answer === "Y") {
                // Saving changes
                saveNotes(notesToKeep);
                console.log(chalk.bgGreen.black(`${important ? "Important" : "Common"} notes has been removed successfully!`));
            } else {
                // Canceling
                process.stdout.write(chalk.bgRed.black(`The action has been canceled.`));
            }
            process.exit();
        });

    } else {
        console.log(chalk.bgRed.black(`Some ${important? "important" : "common"} notes were you're wanting to delete doesn't exist!`));
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

const readNote = function(indexs, important) {
    
    const notes = loadNotes();

    const importantNotes = notes.filter(n => n.important);
    const commonNotes = notes.filter(n => !n.important);

    // Transform to zero indexation
    indexs = indexs.map(i => i - 1);

    // Establishing group of notes with which to work.
    let notesWorkWith = important ? importantNotes : commonNotes;

    // Validating index set
    if (!indexs.some(i => notesWorkWith[i] === undefined)) {
        // Printing notes process
        indexs.map(i => {
            console.log((important ? chalk.redBright(`▼ Note ${i + 1}: `) : chalk.blueBright(`▼ Note ${i + 1}: `)) + notesWorkWith[i].title);
            console.log(chalk.yellow(`[Body]\n`) , notesWorkWith[i].body);
            console.log(chalk.yellow(`--------------------------------------------------`));
        });
    } else {
        console.log(chalk.bgRedBright.black(`Some ${important ? "important" : "common"} notes were you're looking for doesn't exist!`));
    }
}

const listAllNotes = function() {

    const notes = loadNotes();

    if (notes.length !== 0) {

        // Important notes management
        console.log(chalk.bgRedBright.black("Your important notes:"));
        for (let note of notes) {
            if (!note.important) break;
            console.log(chalk.redBright(`▼ Note ${notes.findIndex(n => n.title === note.title) + 1}: `) + note.title);
            console.log(chalk.yellow(`[Body]\n`) , note.body);
            console.log(chalk.yellow(`--------------------------------------------------`));
        }

        // Common notes management
        console.log(chalk.bgBlueBright.black("Your common notes:"));
        for (let note of notes) {
            if (note.important) continue;
            console.log(chalk.blueBright(`▼ Note ${notes.findIndex(n => n.title === note.title) + 1}: `) + note.title);
            console.log(chalk.yellow(`[Body]\n`) , note.body);
            console.log(chalk.yellow(`--------------------------------------------------`));
        }

    } else {
        console.log(chalk.bgBlueBright.black("There are no notes to show! Add one using the 'add' command!"));
    }
}
  
const swapNotes = function(from, to, important) {

    const notes = loadNotes();


    const importantNotes = notes.filter(n => n.important);
    const commonNotes = notes.filter(n => !n.important);

    // Transform to zero indexation
    from--;
    to--;

    // Establishing group of notes with which to work.
    let notesWorkWith = important ? importantNotes : commonNotes;

    // Validating index set
    if (notesWorkWith[from] !== undefined && notesWorkWith[to] !== undefined) {

        let aux = notesWorkWith[to];
        notesWorkWith[to] = notesWorkWith[from];
        notesWorkWith[from] = aux;

        notesWorkWith = important ? notesWorkWith.concat(commonNotes) : importantNotes.concat(notesWorkWith);
        saveNotes(notesWorkWith);
        console.log(chalk.bgGreen.black(`The ${important? "important" : "common"} note ${from+1} was swapped by note ${to+1} successfully!`));
    } else {
        console.log(chalk.bgRed.black("One of the numbers of notes to be swap is invalid."));
    }
}

/// --- GENERAL FUNCTIONS AREA --- ///
function loadNotes() {
    try {
        const dataBuffer = fs.readFileSync("notes.json");

        const dataJSON = dataBuffer.toString();

        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}
function saveNotes(notes) {
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync("notes.json", dataJSON);
}
//////////////////////////////////////

module.exports = {
    getNotes,
    addNote,
    removeNote,
    listNotes,
    listAllNotes,
    readNote,
    swapNotes
}
