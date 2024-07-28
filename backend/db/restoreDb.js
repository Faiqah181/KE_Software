import Restore from "mongodb-restore";

const restoreDb = () => {

    const databaseUri = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;
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