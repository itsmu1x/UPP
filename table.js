const execute = require("./mysql")
execute(
    `CREATE TABLE IF NOT EXISTS files(
        id VARCHAR(50) UNIQUE,
        filePath VARCHAR(150) UNIQUE,
        password VARCHAR(100) NULL DEFAULT NULL
    );`
).then(() => console.log(`Created the table!`))