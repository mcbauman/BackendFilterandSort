import mongoose from 'mongoose'
import Question from './Question.js'

const { Schema, model } = mongoose
const timestamps = true
const required = true
const unique = true
const trim = true

const addressSchema = new Schema({
    street:  { type: String, trim },
    zip:     { type: Number, required },
    city:    { type: String, required, trim },
    country: { type: String, required, trim },
}, { _id: false })

const userSchema = new Schema({
    username:     { type: String, required, trim, unique },
    email:        { type: String, required, trim, unique },
    mainAddress:  { type: addressSchema, required },
    altAddresses: { type: [addressSchema] },
    questions:    { type: [Schema.Types.ObjectId], ref: "question" },
}, { timestamps })

userSchema.pre('remove', async function() {
    console.log("User is being removed " + this._id)
    await Question.deleteMany({ author: this._id })
    await Answer.deleteMany({ author: this._id })
})

const User = model("user", userSchema)
export default User