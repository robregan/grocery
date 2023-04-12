import mongoose from 'mongoose'
const { Schema } = mongoose

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  groceries: [{ type: Schema.Types.ObjectId, ref: 'FormData' }],
})

export default mongoose.model('User', UserSchema)
