// FormModel.js
import mongoose from 'mongoose'

const setYearTo2023 = (dateString) => {
  const date = new Date(dateString)
  date.setFullYear(2023)
  return date
}

const Form = new mongoose.Schema(
  {
    ingredient: String,
    amount: String,
    expiresOn: {
      type: Date,
      set: setYearTo2023, // Use custom setter function
    },
  },
  { timestamps: true }
)

const FormData = mongoose.model('FormData', Form)

export default FormData
