import Restore from "mongodb-restore";
import config from "../config.js";


const restoreDb = () => {

    const databaseUri = `${config.mongoUrl}/${config.dbName}`;
    const zipFilePath = "backup/KE";

    try {
        Restore({
            uri: databaseUri,
            root: zipFilePath
        })
        console.log("done")
        return 200;
    }
    catch (error) {
        console.log(error);
        return 500;
    }

}

export default restoreDb;