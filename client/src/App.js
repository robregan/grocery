// App.js
import React, { useState, useEffect } from 'react'
import api from './api'
import './App.css'
import { FaTrash } from 'react-icons/fa'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.toLocaleDateString()}`
}

const App = () => {
  const [ingredient, setIngredient] = useState('')
  const [amount, setAmount] = useState('')
  const [groceryList, setGroceryList] = useState([])
  const [fetchData, setFetchData] = useState(false)
  const [expiresOn, setExpiresOn] = useState('')

  useEffect(() => {
    const fetchGroceries = async () => {
      const response = await api.get('/')
      if (Array.isArray(response.data)) {
        setGroceryList(response.data)
      } else {
        setGroceryList([])
      }
    }
    fetchGroceries()
  }, [fetchData])

  const deleteGroceryItem = async (id) => {
    try {
      await api.delete(`/delete-item/${id}`)
      setGroceryList(groceryList.filter((item) => item._id !== id))
    } catch (error) {
      console.error('Error deleting grocery item:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/submit-form', {
        ingredient,
        amount,
        expiresOn,
      })
      console.log(response.data)
      setGroceryList([...groceryList, response.data])
      setIngredient('')
      setAmount('')
      setExpiresOn('')
    } catch (error) {
      console.error('Error submitting grocery item:', error)
    }
  }

  return (
    <div className='container'>
      <div className='form-container'>
        <h1>Grocery List</h1>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder='Enter ingredient'
            required
          />
          <input
            type='text'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='Enter amount'
            required
          />
          <label htmlFor='expiresOn'>Expires on:</label>
          <input
            type='date'
            value={expiresOn}
            onChange={(e) => setExpiresOn(e.target.value)}
            placeholder='Expires on'
          />
          <button type='submit'>Add Grocery</button>
        </form>
      </div>
      <div className='list-container'>
        <div className='paper'>
          <ul>
            {groceryList.length > 0 ? (
              groceryList.map((item) => (
                <li key={item._id}>
                  {item.ingredient} - {item.amount} (
                  {formatDate(item.createdAt)})
                  {item.expiresOn && (
                    <span> - Expires on: {formatDate(item.expiresOn)}</span>
                  )}
                  <FaTrash
                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                    onClick={() => deleteGroceryItem(item._id)}
                  />
                </li>
              ))
            ) : (
              <p>No grocery items found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
