import express from 'express';
import auth from '../middleware/auth.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

// @route   GET /api/invoices
// @desc    Get all scanned invoices for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    console.error('Fetch invoices error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete a specific invoice
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (invoice.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await invoice.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
