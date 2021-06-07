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
    
    const amountImportantNotes = notes.filter(n => n.important).length;
    
    // Transform to zero indexation
    indexs = indexs.map(i => i - 1);    
    
    if (!indexs.some(i => notes[important? i : i + amountImportantNotes] === undefined)) { // Check if all index are in range in their respective priority group
        indexs.map(i => {
            if (important) {
                console.log(chalk.redBright(`▼ Note ${i + 1}: `) + notes[i].title);
                console.log(chalk.yellow(`[Body]\n`) , notes[i].body);
                console.log(chalk.yellow(`--------------------------------------------------`));
            } else {
                console.log(chalk.blueBright(`▼ Note ${i + 1 - amountImportantNotes}: `) + notes[i+amountImportantNotes].title);
                console.log(chalk.yellow(`[Body]\n`) , notes[i].body);
                console.log(chalk.yellow(`--------------------------------------------------`));
            }
        });
    } else {
        console.log(chalk.bgRed.black("Some notes were you're looking for doesn't exist!"));
    }
}

const listAllNotes = function() {
    const notes = loadNotes();
    
    const importantNotes = notes.filter(n => n.important);
    const commonNotes = notes.filter(n => !n.important);
    
    if (notes.length !== 0) {
        let indexs = [];
        console.log(chalk.bgRedBright.black("Your important notes:"));
        for (let i = 0; i < importantNotes.length; i++)
            indexs[i] = i+1;    // Use i+1 because "readNote" needs non-zero index array.
        readNotes(indexs, true);

        indexs = [];    
        console.log(chalk.bgBlueBright.black("Your common notes:"));
        for (let i = 0; i < commonNotes.length; i++)
            indexs[i] = i+1;    // Use i+1 because "readNote" needs non-zero index array.
        readNotes(indexs, false);
    } else {
        console.log(chalk.bgBlueBright.black("There are no notes to show! Add one using the 'add' command!"));
    }
}
  
const swapNotes = function(from, to, important) {

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
    listAllNotes,
    readNote,
    swapNotes
}
