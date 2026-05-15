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
  const [showReferenceTable, setShowReferenceTable] = React.useState(false);
  const [showEmailTemplate, setShowEmailTemplate] = React.useState(false);

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

  const generateEmailTemplate = () => {
    const vehicleType = vehicle === 'standard' ? 'Standard Class C Motorhome' : 'Large Class C Motorhome';
    const seasonDisplay = splitSeasonMode
      ? `${seasonOneNights} nights ${season} + ${seasonTwoNights} nights ${seasonTwo}`
      : `${nights} nights ${season}`;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>RV Rental Reservation Request</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family: Arial, sans-serif;">
  <div style="max-width:700px; margin:20px auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
    <!-- HEADER -->
    <div style="background:#1f2937; padding:20px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:22px;">
        RV Rental Reservation Request
      </h1>
    </div>

    <!-- BODY -->
    <div style="padding:24px; color:#111827; line-height:1.6;">
      <!-- WARNING -->
      <p style="color:#dc2626; font-weight:bold; font-size:18px; text-transform:uppercase;">
        THIS IS NOT A RESERVATION CONFIRMATION
      </p>
      <p>Please see the requested rental details below:</p>

      <!-- DETAILS BOX -->
      <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:16px; border-radius:10px; margin:15px 0;">
        <p><strong>Vehicle Type:</strong> ${vehicleType}</p>
        <p><strong>Season/Duration:</strong> ${seasonDisplay}</p>
        <p><strong>Pricing Tier:</strong> ${splitSeasonMode ? sharedTier : rateTier} tier</p>
        <p><strong># of Nights:</strong> ${totalNights}</p>
      </div>

      <!-- PRICING -->
      <div style="margin-top:15px;">
        <p><strong>Rental Total:</strong> $${rentalTotal.toFixed(2)}${aaaDiscount ? ` (After $${aaaDiscountAmount.toFixed(2)} AAA Discount)` : ''}</p>
        <p><strong>Mileage:</strong> $${mileageCost.toFixed(2)} ${unlimitedMileage ? '(Unlimited Plan)' : `(${milesDriven} miles @ $0.39/mile)`}</p>
        ${includeCDW ? `<p><strong>CDW:</strong> $${cdwCost.toFixed(2)}</p>` : ''}
        ${includeWDP ? `<p><strong>WDP:</strong> $${wdpCost.toFixed(2)}</p>` : ''}
        ${housekeepingCost > 0 ? `<p><strong>Housekeeping:</strong> $${housekeepingCost.toFixed(2)} (${housekeepingGuests} guests)</p>` : ''}
        <p><strong>Anchorage Tax (8%):</strong> $${anchorageTax.toFixed(2)}</p>
        <p><strong>Alaska Tax (3%):</strong> $${alaskaTax.toFixed(2)}</p>
      </div>

      <!-- HIGHLIGHT BOX -->
      <div style="background:#fef3c7; border:1px solid #facc15; padding:15px; border-radius:10px; margin-top:20px;">
        <p style="margin:0; font-weight:bold;">
          Important for International Clients
        </p>
        <p style="margin-top:8px;">
          If you'd prefer to send your credit card information in two separate emails, we can book your reservation and send out your confirmation email once we receive all of your credit card information.
        </p>
      </div>

      <!-- TOTAL -->
      <div style="margin-top:20px; padding:15px; background:#f3f4f6; border-radius:10px;">
        <p style="font-size:18px;"><strong>Grand Total:</strong> $${grandTotal.toFixed(2)}</p>
      </div>

      <!-- FOOTER -->
      <p style="margin-top:30px; font-size:12px; color:#6b7280; text-align:center;">
        Please confirm availability for these dates.<br/>
        Thank you — Alaska RV Rental Reservations
      </p>
    </div>
  </div>
</body>
</html>`;
  };

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
              <label htmlFor="splitSeason">Split Seasons</label>
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
              <label htmlFor="unlimited">Unlimited Mileage ($39/day)</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={includeCDW}
                onChange={(e) => setIncludeCDW(e.target.checked)}
                id="cdw"
              />
              <label htmlFor="cdw">Add CDW ($19/day)</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={includeWDP}
                onChange={(e) => setIncludeWDP(e.target.checked)}
                id="wdp"
              />
              <label htmlFor="wdp">Add WDP ($12/day)</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={aaaDiscount}
                onChange={(e) => setAaaDiscount(e.target.checked)}
                id="aaa"
              />
              <label htmlFor="aaa">AAA Discount (5% off rental total)</label>
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
                ? `${seasonOneNights} nights ${season} + ${seasonTwoNights} nights ${seasonTwo} (${sharedTier} tier)`
                : `${rateTier} tier`}
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
            <p>• Anchorage rental tax applies only to the discounted rental total and unlimited mileage package, capped at $240.</p>
            <p>• Alaska state tax applies only to the discounted rental total and unlimited mileage package.</p>
            <p>• CFP is currently excluded from the grand total calculation.</p>
            <p>• Housekeeping package is $35 per guest and is not taxed.</p>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <button
          onClick={() => setShowReferenceTable(!showReferenceTable)}
          className="table-toggle"
        >
          <h3>Quick Reference Table</h3>
          <span className="toggle-icon">
            {showReferenceTable ? '−' : '+'}
          </span>
        </button>

        {showReferenceTable && (
          <div className="table-content">
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
        )}
      </div>

      <div className="email-section">
        <button
          onClick={() => setShowEmailTemplate(!showEmailTemplate)}
          className="email-toggle"
        >
          <h3>Generate Reservation Email</h3>
          <span className="toggle-icon">
            {showEmailTemplate ? '−' : '+'}
          </span>
        </button>

        {showEmailTemplate && (
          <div className="email-content">
            <div className="email-preview">
              <iframe
                srcDoc={generateEmailTemplate()}
                title="Email Preview"
                className="email-iframe"
              />
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(generateEmailTemplate())}
              className="copy-button"
            >
              Copy HTML to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}