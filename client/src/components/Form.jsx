// // src/components/FormComponent.js
// import React, { useState } from 'react'
// import axios from 'axios'

// const Form = () => {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')

//   const handleSubmit = async (event) => {
//     event.preventDefault()
//     const formData = { name, email, message }
//     try {
//       await axios.post('http://localhost:8080/submit-form', formData)
//       alert('Form submitted successfully')
//       setName('')
//       setEmail('')
//       setMessage('')
//     } catch (error) {
//       alert('Error submitting the form')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor='name'>Name:</label>
//       <input
//         type='text'
//         id='name'
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//       />

//       <label htmlFor='email'>Email:</label>
//       <input
//         type='email'
//         id='email'
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />

//       <label htmlFor='message'>Message:</label>
//       <textarea
//         id='message'
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         required
//       />

//       <button type='submit'>Submit</button>
//     </form>
//   )
// }

// export default Form
