import express from 'express'
import createError from 'http-errors'
import Question from '../models/Question.js'
import User from '../models/User.js'

const questionRouter = express.Router()

questionRouter
    .get("/", async (req, res) => {
        try {
            const query = Question.find(req.query)
            query.select("-category -content")
            query.populate("author", "username")

            const questions = await query.exec()
            res.send(questions)
        } catch (error) {
            next(error)
        }
    })
    .get("/:id", async (req, res, next) => {
        try {
            const question = await Question.findById(req.params.id)

            if (!question) {
                return next(createError(404, "Question not found"))
            }

            res.send(question)
        } catch (error) {
            next(error)
        }
    })
    .post("/", async (req, res, next) => {
        try {
            const author = await User.findById(req.body.author)

            if (!author) {
                return next(createError(404, "User not found"))
            }

            const question = await Question.create(req.body)

            author.questions.push(question)
            await author.save()

            res.send(question)
        } catch (error) {
            next(createError(400, error.message))
        }
    })
    .patch("/:id", async (req, res, next) => {
        try {
            const queryOptions = { new: true, runValidators: true }
            const id = req.params.id

            const query = Question.findByIdAndUpdate(id, req.body, queryOptions)
            query.populate("author")

            const question = await query.exec()

            if (!question) {
                return next(createError(404, "Question not found"))
            }

            res.send(question)
        } catch (error) {
            next(createError(400, error.message))
        }
    })
    .delete("/:id", async (req, res, next) => {
        try {
            const question = await Question.findById(req.params.id)

            if (!question) {
                return next(createError(404, "Question not found"))
            }

            await question.remove()
            res.send({ ok: true, deleted: question })
        } catch (error) {
            next(createError(400, error.message))
        }
    })

export default questionRouter