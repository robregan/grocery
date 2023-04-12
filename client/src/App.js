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

  const middleIndex = Math.ceil(groceryList.length / 2)
  const groceryList1 = groceryList.slice(0, middleIndex)
  const groceryList2 = groceryList.slice(middleIndex)

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
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day}`
  }

  // App.js
  // ...

  const formatExpiresOn = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)

    if (isNaN(date.getTime())) return ''

    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day}`
  }
  // ...

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

  const renderGroceryList = (list) => {
    return list.length > 0 ? (
      list.map((item) => (
        <li key={item._id}>
          {item.ingredient} - {item.amount} ({formatDate(item.createdAt)})
          {item.expiresOn && (
            <span> - Expires on: {formatExpiresOn(item.expiresOn)}</span>
          )}
          <div className='icon-container'>
            <button className='icon-btn' onClick={() => handleEdit(item)}>
              ✏️
            </button>
            <button className='icon-btn' onClick={() => handleDelete(item._id)}>
              🗑️
            </button>
          </div>
        </li>
      ))
    ) : (
      <p className='bambi'>No grocery items found</p>
    )
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

  const handleExpirationChange = (e) => {
    const { name, value } = e.target
    let updatedMonth = expirationMonth
    let updatedDay = expirationDay

    if (name === 'expirationMonth') {
      setExpirationMonth(value)
      updatedMonth = value
    } else if (name === 'expirationDay') {
      setExpirationDay(value)
      updatedDay = value
    }

    if (updatedMonth !== '' && updatedDay !== '') {
      const newDate = new Date()
      newDate.setMonth(parseInt(updatedMonth) - 1)
      newDate.setDate(parseInt(updatedDay))
      newDate.setHours(0, 0, 0, 0)

      if (!isNaN(newDate.getTime())) {
        setExpiresOn(newDate.toISOString())
      }
    } else {
      setExpiresOn('')
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
            onChange={handleExpirationChange}
            placeholder='Month'
            name='expirationMonth'
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
            onChange={handleExpirationChange}
            placeholder='Day'
            name='expirationDay'
          />
          <button type='submit'>Add Grocery</button>
        </form>

        {/* <div className='list-container'>
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
      </div> */}

        {/* <div className='list-container'>
        <div className='paper'>
          <ul>{renderGroceryList(groceryList1)}</ul>
        </div>
        <div className='paper'>
          <ul>{renderGroceryList(groceryList2)}</ul>
        </div>
      </div> */}

        <div className='list-container'>
          <div className='paper grocery-list'>
            {renderGroceryList(groceryList.slice(0, groceryList.length / 2))}
          </div>
          <div className='paper grocery-list'>
            {renderGroceryList(groceryList.slice(groceryList.length / 2))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
