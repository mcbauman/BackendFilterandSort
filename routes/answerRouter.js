import express from 'express'
import createError from 'http-errors'
import Answer from '../models/Answer.js'
import Question from '../models/Question.js'

const answerRouter = express.Router()

answerRouter
    .get('/', async (req, res, next) => {
        try {
            const query = Answer.find(req.query)
            query.populate("question", "title")
            query.populate("author", "username")

            const answers = await query.exec()
            res.send(answers)
        } catch (error) {
            next(error)
        }
    })
    .post('/', async (req, res, next) => {
        try {
            const author = await User.findById(req.body.author)

            if (!author) { 
                return next(createError(404, "User not found"))
            }

            const question = await Question.findById(req.body.question)

            if (!question) {
                return next(createError(404, "Question not found"))
            }

            const answer = await Answer.create(req.body)

            author.answers.push(answer)
            await author.save()

            question.answers.push(answer)
            await question.save()

            res.send(answer)
        } catch (error) {
            next(createError(400, error.message))
        }
    })
    .delete('/:id', async (req, res, next) => {
        try {
            const answer = await Answer.findById(req.params.id)

            if (!answer) {
                throw next(createError(404, "Answer not found"))
            }

            await answer.remove()
            res.send({ ok: true, deleted: answer })
        } catch (error) {
            next(createError(400, error))
        }
    })

export default answerRouter