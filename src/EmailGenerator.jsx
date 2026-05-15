import React from 'react';

export default function EmailGenerator({
  vehicle,
  season,
  seasonOneNights,
  seasonTwo,
  seasonTwoNights,
  nights,
  splitSeasonMode,
  milesDriven,
  unlimitedMileage,
  includeCDW,
  includeWDP,
  aaaDiscount,
  housekeepingGuests,
  rates,
}) {
  const [showEmailTemplate, setShowEmailTemplate] = React.useState(false);

  // Calculate values same as Calculator
  const getRateTier = () => {
    if (nights >= 21) return 'long';
    if (nights >= 7) return 'medium';
    return 'short';
  };

  const rateTier = getRateTier();

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

  const housekeepingCost = housekeepingGuests * 35;

  const taxableMileage = unlimitedMileage ? mileageCost : 0;

  const anchorageTax = Math.min(
    (discountedRentalTotal + taxableMileage) * 0.08,
    240
  );

  const alaskaTax =
    (discountedRentalTotal + taxableMileage) * 0.03;

  const grandTotal =
    discountedRentalTotal +
    mileageCost +
    cdwCost +
    wdpCost +
    anchorageTax +
    alaskaTax +
    housekeepingCost;

  const generateEmailTemplate = () => {
    const vehicleType = vehicle === 'standard' ? 'Standard Class C Motorhome' : 'Large Class C Motorhome';
    const seasonDisplay = splitSeasonMode
      ? `${seasonOneNights} nights ${season} + ${seasonTwoNights} nights ${seasonTwo}`
      : `${nights} nights ${season}`;
    const pricingTier = splitSeasonMode ? sharedTier : rateTier;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>RV Rental Reservation Email Preview</title>

<style>
  body {
    font-family: Arial, sans-serif;
    background: #f3f4f6;
    margin: 0;
    padding: 30px;
  }

  .container {
    max-width: 800px;
    margin: auto;
    background: white;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    padding: 24px;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .warning {
    color: #dc2626;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 18px;
    margin-top: 10px;
  }

  .section {
    margin-top: 15px;
    line-height: 1.6;
  }

  .box {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    padding: 15px;
    border-radius: 10px;
    margin-top: 15px;
  }

  .box div {
    margin: 8px 0;
  }

  .red-text {
    color: #dc2626;
    font-weight: bold;
    margin-top: 20px;
  }

  .highlight {
    background: #fef3c7;
    border: 1px solid #facc15;
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
  }

  .button {
    display: inline-block;
    padding: 10px 16px;
    border-radius: 8px;
    color: white;
    text-decoration: none;
    font-weight: bold;
    margin-right: 10px;
    margin-top: 20px;
  }

  .blue { background: #2563eb; }
  .green { background: #16a34a; }

  .footer {
    margin-top: 25px;
    font-size: 12px;
    color: #6b7280;
    text-align: center;
  }

</style>
</head>

<body>

<div class="container">

  <div class="title">RV Rental Reservation Request</div>

  <div class="warning">
    THIS IS NOT A RESERVATION CONFIRMATION
  </div>

  <div class="section">
    Please see the requested rental details below:
  </div>

  <div class="box">
    <div><strong>Vehicle Type:</strong> ${vehicleType}</div>
    <div><strong>Season/Duration:</strong> ${seasonDisplay}</div>
    <div><strong>Pricing Tier:</strong> ${pricingTier} tier</div>
    <div><strong># of Nights:</strong> ${totalNights}</div>
  </div>

  <div class="box">
    <div><strong>Rental Total:</strong> $${rentalTotal.toFixed(2)}</div>
    ${aaaDiscount ? `<div><strong>AAA Discount:</strong> -$${aaaDiscountAmount.toFixed(2)}</div>` : ''}
    <div><strong>Mileage:</strong> $${mileageCost.toFixed(2)} ${unlimitedMileage ? '(Unlimited Plan)' : `(${milesDriven} miles @ $0.39/mile)`}</div>
    ${includeCDW ? `<div><strong>CDW:</strong> $${cdwCost.toFixed(2)}</div>` : ''}
    ${includeWDP ? `<div><strong>WDP:</strong> $${wdpCost.toFixed(2)}</div>` : ''}
    ${housekeepingCost > 0 ? `<div><strong>Housekeeping:</strong> $${housekeepingCost.toFixed(2)} (${housekeepingGuests} guests)</div>` : ''}
    <div><strong>Anchorage Tax (8%):</strong> $${anchorageTax.toFixed(2)}</div>
    <div><strong>Alaska Tax (3%):</strong> $${alaskaTax.toFixed(2)}</div>
  </div>

  <div class="red-text">
    We understand payment in full is required at the time of booking.
  </div>

  <div class="highlight">
    <strong>Important for International Clients</strong>
    <p>
      If you'd prefer to send your credit card information in two separate emails,
      we can book your reservation and send out your confirmation email once we
      receive all of your credit card information.
    </p>
  </div>

  <div class="box">
    <div><strong>Grand Total:</strong> $${grandTotal.toFixed(2)}</div>
  </div>

  <div>
    <a class="button blue" href="tel:1-800-323-5757">Call Reservations</a>
    <a class="button green" href="mailto:reservations@alaskarvrentals.com">Email Us</a>
  </div>

  <div class="footer">
    Please confirm availability for these dates.<br>
    Thank you — Alaska RV Rental Reservations
  </div>

</div>

</body>
</html>`;
  };

  return (
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
  );
}
