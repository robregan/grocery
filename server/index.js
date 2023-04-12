import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './mongodb/connect.js'
import FormData from './mongodb/models/FormModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from './mongodb/models/UserModel.js'

dotenv.config()

const app = express()
const router = express.Router()
app.use(cors())
app.use(express.json())

// routes

// routes

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({ username, email, password: hashedPassword })

  await newUser.save()

  res.status(201).json({ message: 'User created' })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' })
  }

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid email or password' })
  }

  const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
    expiresIn: '1h',
  })

  res.status(200).json({ token, userId: user._id })
})
export default router

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

// new route for editing form data
app.put('/edit/:id', async (req, res) => {
  try {
    const formData = await FormData.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.send(formData)
  } catch (error) {
    res.status(500).send({ message: 'Error processing the request' })
  }
})

app.delete('/delete/:id', async (req, res) => {
  try {
    await FormData.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).send({ message: 'Error processing the request' })
  }
})

// new route for form submission
app.post('/submit-form', async (req, res) => {
  try {
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
