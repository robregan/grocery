import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './mongodb/connect.js'
import FormData from './mongodb/models/FormModel.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// routes

// routes

app.get('/', async (req, res) => {
  try {
    const groceries = await FormData.find({})
    if (groceries.length > 0) {
      res.status(200).send(groceries)
    } else {
      res.status(200).send({ message: 'No grocery items found' })
    }
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving grocery items' })
  }
})

app.delete('/delete-item/:id', async (req, res) => {
  try {
    const item = await FormData.findByIdAndDelete(req.params.id)
    if (!item) {
      return res.status(404).send({ message: 'Item not found' })
    }
    res.status(200).send({ message: 'Item deleted successfully' })
  } catch (error) {
    res.status(500).send({ message: 'Error processing the request' })
  }
})

// new route for form submission
app.post('/submit-form', async (req, res) => {
  try {
    console.log(req.body)
    const formData = new FormData(req.body)

    await formData.save()
    res.status(201).send(formData)
  } catch (error) {
    res.status(500).send({ message: 'Error processing the request' })
  }
})
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL)
    app.listen(8080, () => console.log('Server running on port 8080'))
  } catch (error) {
    console.log(error)
  }
}

startServer()
