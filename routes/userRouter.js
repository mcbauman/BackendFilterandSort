import express from 'express'
import createError from 'http-errors'
import User from '../models/User.js'

const userRouter = express.Router()

userRouter
    .get("/", async (req, res, next) => {
        try {
            const query = User.find(req.query)
            query.populate("questions", "title")

            const users = await query.exec()
            res.send(users)
        } catch (error) {
            next(error)
        }
    })
    .get("/:id", async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)

            if (!user) {
                return next(createError(404, "Question not found"))
            }

            res.send(user)
        } catch (error) {
            next(error)
        }
    })
    .post("/", async (req, res, next) => {
        try {
            const user = await User.create(req.body)
            res.send(user)
        } catch (error) {
            next(createError(400, error.message))
        }
    })
    .delete("/:id", async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)

            if (!user) {
                return next(createError(404, "User not found"))
            }

            await user.remove()
            res.send({ ok: true, deleted: user })
        } catch (error) {
            next(createError(400, error.message))
        }
    })

export default userRouter