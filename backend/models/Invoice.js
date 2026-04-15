import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: String,
  hsnSac: String,
  quantity: Number,
  unit: String,
  rate: Number,
  taxableAmount: Number,
  gstRate: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
  totalAmount: Number
});

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoice: {
    number: String,
    date: String,
    placeOfSupply: String,
    reverseCharge: String,
    totalAmount: Number,
    totalTax: Number,
    amountInWords: String
  },
  seller: {
    name: String,
    gstin: String,
    address: String,
    state: String,
    stateCode: String
  },
  buyer: {
    name: String,
    gstin: String,
    address: String,
    state: String,
    stateCode: String
  },
  items: [itemSchema],
  taxSummary: {
    totalTaxableAmount: Number,
    totalCGST: Number,
    totalSGST: Number,
    totalIGST: Number,
    totalCess: Number,
    roundOff: Number,
    grandTotal: Number
  },
  validation: {
    flags: [String],
    isValid: Boolean,
    timestamp: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
