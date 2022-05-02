import mongoose from 'mongoose'
import Question from './Question.js'
import User from './User.js'

const { Schema, model } = mongoose
const timestamps = true
const required = true
const trim = true

const answerSchema = new Schema({
    author:    { type: Schema.Types.ObjectId, ref: "user", required },
    question:  { type: Schema.Types.ObjectId, ref: "question", required },
    content:   { type: String, required, trim },
}, { timestamps })

answerSchema.pre("remove", async function() {
    const id = this._id.toString()
    console.log("Answer is being removed " + id)

    const author = await User.findById(this.author)
    if (author) {
        author.answers = author.answers.filter(x => x.toString() !== id)
        await author.save()
    }

    const question = await Question.findById(this.question)
    if (question) {
        question.answers = question.answers.filter(x => x.toString() !== id)
        await question.save()
    }
})

const Answer = model("answer", answerSchema)
export default Answer