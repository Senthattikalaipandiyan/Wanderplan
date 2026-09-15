const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

// Helper to check access
const hasTripAccess = (trip, user) => {
  if (!trip) return false;
  return (
    trip.traveler.toString() === user._id.toString() ||
    user.role === 'admin' ||
    (user.role === 'manager' && trip.managerId && trip.managerId.toString() === user._id.toString())
  );
};

// ─── GET /api/expenses?trip=:tripId ──────────────────────
exports.getExpenses = async (req, res) => {
  try {
    const { trip: tripId } = req.query;
    if (!tripId) return res.status(400).json({ success: false, message: 'Trip ID is required.' });

    const trip = await Trip.findById(tripId);
    if (!hasTripAccess(trip, req.user)) return res.status(403).json({ success: false, message: 'Not authorized.' });

    const expenses = await Expense.find({ trip: tripId })
      .populate('user', 'name')
      .sort({ date: -1 });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ success: true, count: expenses.length, total, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/expenses ───────────────────────────────────
exports.addExpense = async (req, res) => {
  try {
    const trip = await Trip.findById(req.body.trip);
    if (!hasTripAccess(trip, req.user)) return res.status(403).json({ success: false, message: 'Not authorized.' });

    const expense = await Expense.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/expenses/:id ───────────────────────────────────
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found.' });

    const trip = await Trip.findById(expense.trip);
    if (!hasTripAccess(trip, req.user)) return res.status(403).json({ success: false, message: 'Not authorized.' });

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, expense: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/expenses/:id ─────────────────────────────
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found.' });

    const trip = await Trip.findById(expense.trip);
    if (!hasTripAccess(trip, req.user)) return res.status(403).json({ success: false, message: 'Not authorized.' });

    await expense.deleteOne();
    res.json({ success: true, message: 'Expense deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/expenses/summary ───────────────────────────
exports.getExpenseSummary = async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId) return res.status(400).json({ success: false, message: 'Trip ID is required.' });

    const trip = await Trip.findById(tripId);
    if (!hasTripAccess(trip, req.user)) return res.status(403).json({ success: false, message: 'Not authorized.' });

    const objectId = require('mongoose').Types.ObjectId(tripId);
    
    const summary = await Expense.aggregate([
      { $match: { trip: objectId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const expensesList = await Expense.find({ trip: tripId });
    const totalCost = expensesList.reduce((sum, e) => sum + e.amount, 0);
    const remainingBudget = trip.budget - totalCost;

    res.json({ success: true, totalCost, remainingBudget, summary, budget: trip.budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
