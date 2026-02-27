'use client'

import { useState, useEffect } from 'react'

export default function ExecutiveDashboard() {
  const [systemStatus, setSystemStatus] = useState(null)
  const [costData, setCostData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch system status
        const statusResponse = await fetch('/api/system-status')
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          setSystemStatus(statusData)
        }

        // Fetch cost tracking
        const costResponse = await fetch('/api/cost-tracking')
        if (costResponse.ok) {
          const costData = await costResponse.json()
          setCostData(costData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading Executive Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">OpenClaw Executive Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* System Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
            {systemStatus ? (
              <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(systemStatus, null, 2)}
              </pre>
            ) : (
              <div className="text-gray-500">
                No system status data available. 
                <br />
                <span className="text-sm">Optimus will populate /opt/smarterrevolution-infrastructure/status/system-status.json</span>
              </div>
            )}
          </div>

          {/* Cost Tracking Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Tracking</h2>
            {costData ? (
              <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(costData, null, 2)}
              </pre>
            ) : (
              <div className="text-gray-500">
                No cost tracking data available.
                <br />
                <span className="text-sm">Optimus will populate /opt/smarterrevolution-infrastructure/status/cost-tracking.json</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Dashboard Status</h3>
          <p className="text-blue-700">
            This is a placeholder version. The full dashboard component will be integrated once provided.
            API routes are configured and ready to serve data from Optimus-maintained JSON files.
          </p>
        </div>
      </div>
    </div>
  )
}