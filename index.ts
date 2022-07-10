import express from 'express'
import fileUpload from 'express-fileupload'
const app = express()

app.use("/public", express.static("public"))
app.set('view engine', 'ejs')
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }
}))

app.get('/', (req,res) => {
    res.render("index")
})

app.listen(3001, () => console.log(`opening in port 3001?`))