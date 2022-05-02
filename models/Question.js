import mongoose from 'mongoose'
import User from './User.js'
import Answer from './Answer.js'

const { Schema, model } = mongoose
const timestamps = true
const required = true
const unique = true
const trim = true

const questionSchema = new Schema({
    author:   { type: Schema.Types.ObjectId, ref: "user", required },
    title:    { type: String, required, trim, unique },
    content:  { type: String, required, trim },
    category: { type: String, required, default: "Random" },
    type:     { type: String, required, enum: ["internal", "external"] },
    answers:  { type: [Schema.Types.ObjectId], ref: "answer" },
}, { timestamps })

questionSchema.pre("remove", async function() {
    const id = this._id.toString()
    console.log("Question is being removed " + id)

    const author = await User.findById(this.author)
    if (author) {
        author.questions = author.questions.filter(x => x.toString() !== id)
        await author.save()
    }

    await Answer.deleteMany({ question: this._id })
})

// The following are examples of additional middleware/hooks
// questionSchema.pre("save", async function() {
//     console.log("Saving new document", this)
//     if (this.title.includes("snake")) {
//         throw new Error("No snake questions!!!")
//     }
// })
// questionSchema.post("save", async function() {
//     console.log("Saved new document", this)
// })

const Question = model("question", questionSchema)
export default Question