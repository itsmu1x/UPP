const express = require('express')
const fileUpload = require('express-fileupload')
const { v4: uuidV4 } = require("uuid")
const execute = require('./mysql')
const bcrypt = require("bcrypt")

/*
execute(
    `CREATE TABLE IF NOT EXISTS files(
        id VARCHAR(50) UNIQUE,
        filePath VARCHAR(150) UNIQUE,
        password VARCHAR(100) NULL DEFAULT NULL
    );`
).then(() => console.log(`Created the table!`))
*/

const app = express()
app.use("/public", express.static("public"))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 30 * 1024 * 1024 }
}))

app.get('/', (req, res) => {
    res.render("index")
})

const downloadRoute = async (req, res) => {
    const { password = '' } = req?.body || {}
    const { uuid = '' } = req.params
    const files = await execute("SELECT * FROM files WHERE id=?", [uuid])
    if (!files?.length) return res.redirect("/")

    const file = files[0]
    if (file.password != null) {
        const compared = await bcrypt.compare(password, file.password)
        if (!compared)
            return res.render("download", { uuid: file.id })
    }

    return res.download(__dirname + file.filePath, `file.${getExt(file.filePath)}`)
}

app.get("/download/:uuid", downloadRoute)
app.post("/download/:uuid", downloadRoute)

app.post('/api/uploadFile', async (req, res) => {
    if (req.files == null || !req.files?.file) return res.json({ status: false, message: "No files were uploaded" })
    const { password = null } = req.body
    const salt = await bcrypt.genSalt(12)
    const finalPassword = await (password ? bcrypt.hash(password, salt) : password)

    try {
        const file = req.files.file
        const uuid = uuidV4()
        const filePath = "/uploads/" + uuid + "." + getExt(file.name)
        await file.mv(__dirname + filePath)
        await execute("INSERT INTO files VALUES (?, ?, ?)", [uuid, filePath, finalPassword || null])
        return res.json({ status: true, message: "uploaded the file", uuid })
    } catch {
        res.json({ status: false, message: "error white uploading your file!" })
    }
})

function getExt(name) {
    if (!name) return ""
    const list = name.split("\.")
    return list[list.length - 1]
}

app.listen(3001, () => console.log(`opening in port 3001?`))