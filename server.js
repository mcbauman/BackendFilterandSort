import express from 'express'
import dotenv from 'dotenv'
import { connect } from './lib/database.js'
import questionRouter from './routes/questionRouter.js'
import userRouter from './routes/userRouter.js'
import answerRouter from './routes/answerRouter.js'
import requestLogger from './middlewares/requestLogger.js'
import globalErrorHandler from './middlewares/globalErrorHandler.js'
import resourceNotFound from './middlewares/resourceNotFound.js'

dotenv.config()
connect()
const app = express()
app.use(express.json())
app.use(requestLogger)

app.use("/answers", answerRouter)
app.use("/questions", questionRouter)
app.use("/users", userRouter)

app.use(resourceNotFound)
app.use(globalErrorHandler)

app.listen(process.env.PORT, () => {
    console.log("Up: http://localhost:" + process.env.PORT)
})