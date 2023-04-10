import mongoose from 'mongoose'

// Schema and model for form data
const Form = new mongoose.Schema(
  {
    ingredient: String,
    amount: String,
    expiresOn: { type: Date, default: null },
  },
  { timestamps: true }
)

const FormData = mongoose.model('FormData', Form)

export default FormData
