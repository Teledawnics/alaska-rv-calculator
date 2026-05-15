import React from 'react';

export default function AlaskaRVCalculator() {
  const rates = {
    spring: {
      label: 'May 1 – June 14',
      standard: { short: 199, medium: 179, long: 169 },
      large: { short: 219, medium: 199, long: 189 },
    },
    peak: {
      label: 'June 15 – August 15',
      standard: { short: 349, medium: 319, long: 309 },
      large: { short: 369, medium: 339, long: 329 },
    },
    fall: {
      label: 'August 16 – September 30',
      standard: { short: 199, medium: 179, long: 169 },
      large: { short: 219, medium: 199, long: 189 },
    },
  };

  const mileageTable = {
    4: 156, 5: 195, 6: 234, 7: 273, 8: 312,
    9: 351, 10: 390, 11: 429, 12: 468, 13: 507,
    14: 546, 15: 585, 16: 624, 17: 663, 18: 702,
    19: 741, 20: 780, 21: 819, 22: 858, 23: 897,
    24: 936, 25: 975,
  };

  const cdwTable = {
    4: 76, 5: 95, 6: 114, 7: 133, 8: 152,
    9: 171, 10: 190, 11: 209, 12: 228, 13: 247,
    14: 266, 15: 285, 16: 304, 17: 323, 18: 342,
    19: 361, 20: 380, 21: 399, 22: 418, 23: 437,
    24: 456, 25: 475,
  };

  const wdpTable = {
    4: 48, 5: 60, 6: 72, 7: 84, 8: 96,
    9: 108, 10: 120, 11: 132, 12: 144, 13: 156,
    14: 168, 15: 180, 16: 192, 17: 204, 18: 216,
    19: 228, 20: 240, 21: 252, 22: 264, 23: 276,
    24: 288, 25: 300,
  };

  const [season, setSeason] = React.useState('spring');
  const [splitSeasonMode, setSplitSeasonMode] = React.useState(false);
  const [seasonOneNights, setSeasonOneNights] = React.useState(7);
  const [seasonTwo, setSeasonTwo] = React.useState('peak');
  const [seasonTwoNights, setSeasonTwoNights] = React.useState(3);
  const [vehicle, setVehicle] = React.useState('standard');
  const [nights, setNights] = React.useState(7);
  const [unlimitedMileage, setUnlimitedMileage] = React.useState(false);
  const [includeCDW, setIncludeCDW] = React.useState(false);
  const [includeWDP, setIncludeWDP] = React.useState(false);
  const [aaaDiscount, setAaaDiscount] = React.useState(false);
  const [milesDriven, setMilesDriven] = React.useState(700);
  const [housekeepingGuests, setHousekeepingGuests] = React.useState(0);

  const getRateTier = () => {
    if (nights >= 21) return 'long';
    if (nights >= 7) return 'medium';
    return 'short';
  };

  const rateTier = getRateTier();

  // Split season pricing still uses the TOTAL trip length
  // to determine the pricing tier
  const combinedTripNights = splitSeasonMode
    ? seasonOneNights + seasonTwoNights
    : nights;

  const sharedTier = (() => {
    if (combinedTripNights >= 21) return 'long';
    if (combinedTripNights >= 7) return 'medium';
    return 'short';
  })();

  const nightlyRate = rates[season][vehicle][rateTier];

  const rentalTotal = splitSeasonMode
    ? (
        rates[season][vehicle][sharedTier] * seasonOneNights +
        rates[seasonTwo][vehicle][sharedTier] * seasonTwoNights
      )
    : nightlyRate * nights;

  const totalNights = splitSeasonMode
    ? seasonOneNights + seasonTwoNights
    : nights;

  const mileageCost = unlimitedMileage
    ? totalNights * 39
    : milesDriven * 0.39;

  const cdwCost = includeCDW ? totalNights * 19 : 0;
  const wdpCost = includeWDP ? totalNights * 12 : 0;

  const aaaDiscountAmount = aaaDiscount
    ? rentalTotal * 0.05
    : 0;

  const discountedRentalTotal = rentalTotal - aaaDiscountAmount;

  // CFP removed from total calculation based on provided pricing formula
  const cfpCost = 0;

  const housekeepingCost = housekeepingGuests * 35;

  // Only unlimited mileage package is taxable
  const taxableMileage = unlimitedMileage ? mileageCost : 0;

  // Anchorage tax capped at $240
  const anchorageTax = Math.min(
    (discountedRentalTotal + taxableMileage) * 0.08,
    240
  );

  // Alaska state tax
  const alaskaTax =
    (discountedRentalTotal + taxableMileage) * 0.03;

  const grandTotal =
    discountedRentalTotal +
    mileageCost +
    cdwCost +
    wdpCost +
    cfpCost +
    anchorageTax +
    alaskaTax +
    housekeepingCost;

  return (
    <div className="container">
      <h1>Alaska Motorhome Rental Calculator</h1>

      <p className="subtitle">
        Updated tax logic with untaxed housekeeping and unlimited mileage-only taxation.
      </p>

      <div className="grid">
        {/* LEFT SIDE */}
        <div>
          <div className="section">
            <label>Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              {Object.entries(rates).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div className="section">
            <label>Vehicle Size</label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            >
              <option value="standard">Standard Class C</option>
              <option value="large">Large Class C</option>
            </select>
          </div>

          <div className="section">
            <label>Enable Split Season Pricing</label>
            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={splitSeasonMode}
                onChange={(e) => setSplitSeasonMode(e.target.checked)}
                id="splitSeason"
              />
              <label htmlFor="splitSeason" style={{ marginBottom: 0 }}>Split Seasons</label>
            </div>
          </div>

          {!splitSeasonMode ? (
            <div className="section">
              <label># of Nights</label>
              <input
                type="number"
                min="4"
                max="25"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
              />
            </div>
          ) : (
            <>
              <div className="section">
                <label>Season 1 Nights</label>
                <input
                  type="number"
                  min="1"
                  value={seasonOneNights}
                  onChange={(e) => setSeasonOneNights(Number(e.target.value))}
                />
              </div>
              <div className="section">
                <label>Season 2</label>
                <select
                  value={seasonTwo}
                  onChange={(e) => setSeasonTwo(e.target.value)}
                >
                  {Object.entries(rates).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="section">
                <label>Season 2 Nights</label>
                <input
                  type="number"
                  min="1"
                  value={seasonTwoNights}
                  onChange={(e) => setSeasonTwoNights(Number(e.target.value))}
                />
              </div>
            </>
          )}

          <div className="section">
            <label>Housekeeping Package (# of Guests)</label>
            <input
              type="number"
              min="0"
              value={housekeepingGuests}
              onChange={(e) => setHousekeepingGuests(Number(e.target.value))}
            />
          </div>

          <div className="section">
            <label>Estimated Miles</label>
            <input
              type="number"
              value={unlimitedMileage ? '' : milesDriven}
              onChange={(e) => setMilesDriven(Number(e.target.value))}
              disabled={unlimitedMileage}
              placeholder={
                unlimitedMileage
                  ? 'Unlimited mileage selected'
                  : 'Enter estimated miles'
              }
            />
          </div>

          <div className="checkbox-group">
            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={unlimitedMileage}
                onChange={(e) => setUnlimitedMileage(e.target.checked)}
                id="unlimited"
              />
              <label htmlFor="unlimited" style={{ marginBottom: 0 }}>Unlimited Mileage ($39/day)</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={includeCDW}
                onChange={(e) => setIncludeCDW(e.target.checked)}
                id="cdw"
              />
              <label htmlFor="cdw" style={{ marginBottom: 0 }}>Add CDW ($19/day)</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={includeWDP}
                onChange={(e) => setIncludeWDP(e.target.checked)}
                id="wdp"
              />
              <label htmlFor="wdp" style={{ marginBottom: 0 }}>Add WDP ($12/day)</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={aaaDiscount}
                onChange={(e) => setAaaDiscount(e.target.checked)}
                id="aaa"
              />
              <label htmlFor="aaa" style={{ marginBottom: 0 }}>AAA Discount (5% off rental total)</label>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="card">
          <h2>Rental Breakdown</h2>

          <div className="breakdown-row">
            <span>Rate Structure</span>
            <span>
              {splitSeasonMode
                ? `${seasonOneNights}n ${season} + ${seasonTwoNights}n ${seasonTwo}`
                : rateTier}
            </span>
          </div>

          <div className="breakdown-row">
            <span>Rental Total</span>
            <strong>${rentalTotal.toFixed(2)}</strong>
          </div>

          <div className="breakdown-row green">
            <span>AAA Discount</span>
            <strong>-${aaaDiscountAmount.toFixed(2)}</strong>
          </div>

          <div className="breakdown-row">
            <span>Mileage</span>
            <span>${mileageCost.toFixed(2)}</span>
          </div>

          <div className="breakdown-row">
            <span>CDW</span>
            <span>${cdwCost.toFixed(2)}</span>
          </div>

          <div className="breakdown-row">
            <span>WDP</span>
            <span>${wdpCost.toFixed(2)}</span>
          </div>

          <div className="breakdown-row">
            <span>Housekeeping</span>
            <span>${housekeepingCost.toFixed(2)}</span>
          </div>

          <div className="breakdown-row">
            <span>Anchorage Tax (8%)</span>
            <strong>${anchorageTax.toFixed(2)}</strong>
          </div>

          <div className="breakdown-row">
            <span>Alaska Tax (3%)</span>
            <span>${alaskaTax.toFixed(2)}</span>
          </div>

          <div className="total-row">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <div className="notes">
            <p>• Mileage without unlimited plan is charged at $0.39/mile.</p>
            <p>• Anchorage rental tax capped at $240.</p>
            <p>• Housekeeping package ($35/guest) is not taxed.</p>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <h3>Quick Reference Table</h3>
        <table>
          <thead>
            <tr>
              <th>Nights</th>
              <th>Unlimited Mileage</th>
              <th>CDW</th>
              <th>WDP</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(mileageTable).map((night) => (
              <tr key={night}>
                <td>{night}</td>
                <td>${mileageTable[night]}</td>
                <td>${cdwTable[night]}</td>
                <td>${wdpTable[night]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}