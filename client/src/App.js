// App.js
import React, { useState, useEffect } from 'react'
import api from './api'
import './App.css'
import { FaTrash } from 'react-icons/fa'

const App = () => {
  const [ingredient, setIngredient] = useState('')
  const [amount, setAmount] = useState('')
  const [groceryList, setGroceryList] = useState([])
  const [fetchData, setFetchData] = useState(false)
  const [expiresOn, setExpiresOn] = useState('')
  const [expirationDay, setExpirationDay] = useState('')
  const [expirationMonth, setExpirationMonth] = useState('')
  const [editingItem, setEditingItem] = useState(null)

  const handleEdit = (item) => {
    setEditingItem(item)
    setIngredient(item.ingredient)
    setAmount(item.amount)
    setExpiresOn(item.expiresOn)
  }
  const handleDelete = async (id) => {
    try {
      await api.delete(`/delete/${id}`)
      setGroceryList(groceryList.filter((item) => item._id !== id))
    } catch (error) {
      console.error('Error deleting grocery item:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()}`
  }

  const formatExpiresOn = (dateString) => {
    const date = new Date(dateString)
    const formatter = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
    })
    return formatter.format(date)
  }

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
      let response
      if (editingItem) {
        response = await api.put(`/edit/${editingItem._id}`, {
          ingredient,
          amount,
          expiresOn,
        })
        setGroceryList(
          groceryList.map((item) =>
            item._id === editingItem._id ? response.data : item
          )
        )
        setEditingItem(null)
      } else {
        response = await api.post('/submit-form', {
          ingredient,
          amount,
          expiresOn,
        })
        setGroceryList([...groceryList, response.data])
      }
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
          <select
            value={expirationMonth}
            onChange={(e) => setExpirationMonth(e.target.value)}
            placeholder='Month'
          >
            <option value='' disabled>
              Month
            </option>
            <option value='01'>January</option>
            <option value='02'>February</option>
            <option value='03'>March</option>
            <option value='04'>April</option>
            <option value='05'>May</option>
            <option value='06'>June</option>
            <option value='07'>July</option>
            <option value='08'>August</option>
            <option value='09'>September</option>
            <option value='10'>October</option>
            <option value='11'>November</option>
            <option value='12'>December</option>
          </select>
          <input
            type='number'
            min='1'
            max='31'
            value={expirationDay}
            onChange={(e) => setExpirationDay(e.target.value)}
            placeholder='Day'
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
                    <span>
                      {' '}
                      - Expires on: {formatExpiresOn(item.expiresOn)}
                    </span>
                  )}
                  <button className='icon-btn' onClick={() => handleEdit(item)}>
                    ✏️
                  </button>
                  <button
                    className='icon-btn'
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑️
                  </button>
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
