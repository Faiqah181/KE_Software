import express from "express";
import MongoBackup from "../db/MongoBackup.js";
import { readdir } from 'fs/promises'
import { statSync } from "fs";

const BackupRestoreRouter = express.Router();


BackupRestoreRouter.get("/backups/", async (req, res) => {
    const backups = (await readdir('./backups/', { withFileTypes: true }))
                    .filter(dirent => dirent
                    .isDirectory())
                    .map(dirent => dirent.name)
                    .sort((b, a) => statSync('./backups/' + a).mtime.getTime() - statSync('./backups/' + b).mtime.getTime());
    
    res.send(backups);
});

BackupRestoreRouter.post("/backup", async (req, res) => {
    const backupName = req.body.backupName ? req.body.backupName : new Date().toISOString().slice(0,10);
    const mongoBackup = new MongoBackup("KE");
    mongoBackup.backup("./backups", backupName, res);
});

BackupRestoreRouter.post("/restore", async (req, res) => {
    const backupName = req.body?.backupName;
    if (!backupName) { 
        res.sendStatus(404); 
        return;
    }

    const mongoBackup = new MongoBackup("KE");
    mongoBackup.restore("./backups", backupName, res);
});

export default BackupRestoreRouter;