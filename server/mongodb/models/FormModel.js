// FormModel.js
import mongoose from 'mongoose'

const setYearTo2023 = (dateString) => {
  const date = new Date(dateString)
  date.setFullYear(2023)
  return date
}

const GrocerySchema = new mongoose.Schema(
  {
    ingredient: String,
    amount: String,
    expiresOn: {
      type: Date,
      set: setYearTo2023, // Use custom setter function
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const FormData = mongoose.model('FormData', GrocerySchema)

export default FormData
