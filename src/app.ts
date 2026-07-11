import express from 'express'
import routes from './routes'
import cors from 'cors'
import { errorHandler } from './middlewares/error.middleware'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)
app.use(errorHandler)

export default app
