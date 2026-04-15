export function runGSTValidation(parsedData) {
  const validationFlags = [];
  
  if (!parsedData) return { isValid: false, flags: ['No data parsed'] };

  // 1. Verify that GSTINs are valid lengths and format
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (parsedData.seller?.gstin) {
    if (!gstinRegex.test(parsedData.seller.gstin)) {
      validationFlags.push('Seller GSTIN has an invalid format.');
    }
  }

  if (parsedData.buyer?.gstin) {
    if (!gstinRegex.test(parsedData.buyer.gstin)) {
      validationFlags.push('Buyer GSTIN has an invalid format.');
    }
  }

  // 2. Arithmetic validation
  let computedTaxableAmt = 0;
  let computedCGST = 0;
  let computedSGST = 0;
  let computedIGST = 0;

  if (Array.isArray(parsedData.items)) {
    parsedData.items.forEach((item, index) => {
      const taxableAmount = item.taxableAmount || 0;
      const cgst = item.cgst || 0;
      const sgst = item.sgst || 0;
      const igst = item.igst || 0;
      const rate = item.gstRate || 0;
      
      computedTaxableAmt += taxableAmount;
      computedCGST += cgst;
      computedSGST += sgst;
      computedIGST += igst;

      // Verify individual item tax
      const expectedTax = (taxableAmount * rate) / 100;
      const actualTax = cgst + sgst + igst;
      
      if (Math.abs(expectedTax - actualTax) > 1.0) { // Tolerance of 1 Rupee due to rounding
        validationFlags.push(`Item ${index + 1} (${item.description || 'Unknown'}) tax calculation mismatch. Expected ~${expectedTax.toFixed(2)}, got ${actualTax.toFixed(2)}.`);
      }
    });
  }

  // 3. Tax summary validation
  if (parsedData.taxSummary) {
    const ts = parsedData.taxSummary;
    if (Math.abs((ts.totalCGST || 0) - computedCGST) > 1.0) {
      validationFlags.push('Summary Total CGST mismatches computed item CGST.');
    }
    if (Math.abs((ts.totalSGST || 0) - computedSGST) > 1.0) {
      validationFlags.push('Summary Total SGST mismatches computed item SGST.');
    }
    if (Math.abs((ts.totalIGST || 0) - computedIGST) > 1.0) {
      validationFlags.push('Summary Total IGST mismatches computed item IGST.');
    }
    
    const computedGrandTotal = computedTaxableAmt + computedCGST + computedSGST + computedIGST + (ts.totalCess || 0) + (ts.roundOff || 0);
    if (Math.abs((ts.grandTotal || 0) - computedGrandTotal) > 2.0) {
      validationFlags.push(`Summary Grand Total (${ts.grandTotal}) mismatches calculated sum (~${computedGrandTotal.toFixed(2)}).`);
    }

    if (Math.abs((ts.totalTaxableAmount || 0) - computedTaxableAmt) > 1.0) {
      validationFlags.push(`Summary Total Taxable Amount (${ts.totalTaxableAmount}) mismatches computed items (~${computedTaxableAmt.toFixed(2)}).`);
    }
  }

  parsedData.validation = {
    flags: validationFlags,
    isValid: validationFlags.length === 0,
    timestamp: new Date().toISOString()
  };

  return parsedData;
}
