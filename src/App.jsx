import React from 'react';
import Calculator from './Calculator';
import EmailGenerator from './EmailGenerator';

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
    <>
      <Calculator
        rates={rates}
        mileageTable={mileageTable}
        cdwTable={cdwTable}
        wdpTable={wdpTable}
        season={season}
        setSeason={setSeason}
        splitSeasonMode={splitSeasonMode}
        setSplitSeasonMode={setSplitSeasonMode}
        seasonOneNights={seasonOneNights}
        setSeasonOneNights={setSeasonOneNights}
        seasonTwo={seasonTwo}
        setSeasonTwo={setSeasonTwo}
        seasonTwoNights={seasonTwoNights}
        setSeasonTwoNights={setSeasonTwoNights}
        vehicle={vehicle}
        setVehicle={setVehicle}
        nights={nights}
        setNights={setNights}
        unlimitedMileage={unlimitedMileage}
        setUnlimitedMileage={setUnlimitedMileage}
        includeCDW={includeCDW}
        setIncludeCDW={setIncludeCDW}
        includeWDP={includeWDP}
        setIncludeWDP={setIncludeWDP}
        aaaDiscount={aaaDiscount}
        setAaaDiscount={setAaaDiscount}
        milesDriven={milesDriven}
        setMilesDriven={setMilesDriven}
        housekeepingGuests={housekeepingGuests}
        setHousekeepingGuests={setHousekeepingGuests}
      />

      <EmailGenerator
        vehicle={vehicle}
        season={season}
        seasonOneNights={seasonOneNights}
        seasonTwo={seasonTwo}
        seasonTwoNights={seasonTwoNights}
        nights={nights}
        splitSeasonMode={splitSeasonMode}
        milesDriven={milesDriven}
        unlimitedMileage={unlimitedMileage}
        includeCDW={includeCDW}
        includeWDP={includeWDP}
        aaaDiscount={aaaDiscount}
        housekeepingGuests={housekeepingGuests}
        rates={rates}
      />
    </>
  );
}