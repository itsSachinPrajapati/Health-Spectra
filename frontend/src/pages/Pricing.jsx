import DashboardHeader from '../PatientDashboard/DashboardHeader'
import { PricingTable } from '@clerk/clerk-react'
import React from 'react'

function Pricing() {
  return (
    <div>
      <DashboardHeader />

      {/* Outer spacing */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Heading block */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-blue-600">💎 Join Our Program</h2>
          <p className="mt-3 text-gray-600 text-sm">
            Choose the plan that fits your healthcare needs.
          </p>
        </div>
          
        {/* Clerk Pricing Table */}
        <div className="pricing-container transition-shadow duration-300 hover:shadow-lg">
          <PricingTable />
        </div>

      </div>
    </div>
  )
}

export default Pricing
