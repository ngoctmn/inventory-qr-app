'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState('Loading...')
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test API connection
      const res = await fetch('/api/cycles?active=true')
      const result = await res.json()
      
      if (result.data) {
        setMessage('✅ Connected to database!')
        setData(result.data)
      } else {
        setMessage('⚠️ No active cycle found')
      }
    } catch (error) {
      setMessage('❌ Connection error: ' + error)
    }
  }

  const createTestCycle = async () => {
    try {
      const res = await fetch('/api/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Cycle ' + new Date().toLocaleString(),
          description: 'Test cycle'
        })
      })
      
      const result = await res.json()
      if (result.data) {
        alert('Created cycle successfully!')
        testConnection()
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg">{message}</p>
      </div>

      {data && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <h2 className="font-bold">Active Cycle:</h2>
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      <div className="space-x-4">
        <button 
          onClick={testConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Connection
        </button>
        
        <button 
          onClick={createTestCycle}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Test Cycle
        </button>
        
        <a 
          href="/"
          className="inline-block bg-gray-500 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}