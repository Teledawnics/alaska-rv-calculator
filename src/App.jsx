import React from 'react'

export default function App() {
  const rates = {
    spring: {
      label: 'May 1 – June 14',
      standard: { short: 199, medium: 179, long: 169 },
      large: { short: 219, medium: 199, long: 189 }
    },
    peak: {
      label: 'June 15 – August 15',
      standard: { short: 349, medium: 319, long: 309 },
      large: { short: 369, medium: 339, long: 329 }
    },
    fall: {
      label: 'August 16 – September 30',
      standard: { short: 199, medium: 179, long: 169 },
      large: { short: 219, medium: 199, long: 189 }
    }
  }

  const [season, setSeason] = React.useState('spring')
  const [vehicle, setVehicle] = React.useState('standard')
  const [nights, setNights] = React.useState(7)
  const [miles, setMiles] = React.useState(700)

  const tier = nights >= 21 ? 'long' : nights >= 7 ? 'medium' : 'short'

  const nightly = rates[season][vehicle][tier]
  const rental = nightly * nights

  const mileage = miles * 0.39
  const tax = (rental + mileage) * 0.11

  const total = rental + mileage + tax

  return (
    <div style={{ padding: 20 }}>
      <h1>Alaska RV Calculator</h1>

      <select value={season} onChange={e => setSeason(e.target.value)}>
        {Object.entries(rates).map(([k,v]) => (
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>

      <select value={vehicle} onChange={e => setVehicle(e.target.value)}>
        <option value="standard">Standard</option>
        <option value="large">Large</option>
      </select>

      <input
        type="number"
        value={nights}
        onChange={e => setNights(Number(e.target.value))}
      />

      <input
        type="number"
        value={miles}
        onChange={e => setMiles(Number(e.target.value))}
      />

      <hr />

      <p>Rental: ${rental.toFixed(2)}</p>
      <p>Mileage: ${mileage.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <h2>Total: ${total.toFixed(2)}</h2>
    </div>
  )
}
