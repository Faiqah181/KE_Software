import { spawn } from 'child_process'
import mongoose from 'mongoose';

class MongoBackup {
    constructor(dbName) {
        this.dbName = dbName;
    }

    backup(path, backupName, res, debugMode) {
        const mongodump = spawn('mongodump', [
            // '--host', this.dbUrl,
            // '--port',     this.dbport,
            // '--username', this.dbuser,
            // '--password', this.dbpass,
            '--db', this.dbName,
            '--out', `${path}/${backupName}`,
            '--gzip',
        ]);
        if(debugMode) {
            mongodump.stdout.on('data', function (data) { console.log('stdout: ' + data); });
            mongodump.stderr.on('data', function (data) { console.log('stderr: ' + data); });
        }
        mongodump.on('exit', (code) => {
            console.log('mongodump exited with code ' + code);
            if (code === 0) {
                res.sendStatus(200);
            }
            else res.sendStatus(500);
        });
    }

    async restore(path, backupName, res, debugMode) {
        await mongoose.connection.db.dropDatabase();

        const mongorestore = spawn('mongorestore', [
            // '--host', this.dbUrl,
            // '--port',     this.dbport,
            // '--username', this.dbuser,
            // '--password', this.dbpass,
            `${path}/${backupName}`,
            '--gzip'
        ]);
        if(debugMode) {
            mongorestore.stdout.on('data', function (data) { console.log('stdout: ' + data); });
            mongorestore.stderr.on('data', function (data) { console.log('stderr: ' + data); });
        }
        
        mongorestore.on('exit', (code) => {
            console.log('mongorestore exited with code ' + code);
            if (code === 0) {
                res.sendStatus(200);
            }
            else res.sendStatus(500);
        });
    }

}

export default MongoBackup;