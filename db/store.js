const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    read() {
        return readFileAsync('db/db.json', 'utf8');
    }

    write(note) {
        return writeFileAsync('db/db.json', JSON.stringify(note));
    }

    async getNotes() {
        const notes = await this.read();
        let parsedNotes;
        try {
            parsedNotes = [].concat(JSON.parse(notes));
        } catch (err) {
            parsedNotes = [];
        }
        return parsedNotes;
    }

    async addNotes(note) {
        const { title, text } = note;

        if (!title || !text) {
        throw new Error("Note 'title' and 'text' cannot be blank");
        }

        // Add a unique id to the note using uuid package
        const newNote = { title, text, id: this.getNotes.length.toString() };

        // Get all notes, add the new note, write all the updated notes, return the newNote
        return this.getNotes()
        .then((notes) => [...notes, newNote])
        .then((updatedNotes) => this.write(updatedNotes))
        .then(() => newNote);
    }

    async removeNotes(id) {
        const notes = await this.getNotes();
        const newNotes = notes.filter(note => note.id !== id);
        return this.write(newNotes);
    }
}


module.exports = new Store();