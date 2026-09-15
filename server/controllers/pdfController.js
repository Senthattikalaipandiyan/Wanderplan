const PDFDocument = require('pdfkit');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Suggestion = require('../models/Suggestion');
const User = require('../models/User');

exports.generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch Trip
    const trip = await Trip.findById(id).populate('traveler', 'name email').populate('managerId', 'name email');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    // Fetch Expenses
    const expenses = await Expense.find({ trip: id });
    const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
    const expenseSummary = await Expense.aggregate([
      { $match: { trip: require('mongoose').Types.ObjectId(id) } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    // Fetch Suggestions
    const suggestions = await Suggestion.find({ tripId: id }).sort({ createdAt: 1 }).populate('managerId', 'name');

    // Setup PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Trip_Report_${trip.destination}.pdf`);
    doc.pipe(res);

    // Title
    doc.fontSize(20).text('WanderPlan Trip Report', { align: 'center' });
    doc.moveDown();

    // Trip Info
    doc.fontSize(14).text('Trip Details', { underline: true });
    doc.fontSize(12).text(`Destination: ${trip.destination}, ${trip.country}`);
    doc.text(`Dates: ${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()}`);
    doc.text(`Traveler: ${trip.traveler.name} (${trip.traveler.email})`);
    doc.text(`Trip Manager: ${trip.managerId ? trip.managerId.name : 'Unassigned'}`);
    doc.text(`Status: ${trip.status}`);
    doc.moveDown();

    // Itinerary
    doc.fontSize(14).text('Full Itinerary', { underline: true });
    if (!trip.itinerary || trip.itinerary.length === 0) {
      doc.fontSize(12).text('No activities planned yet.');
    } else {
      trip.itinerary.forEach((day, index) => {
        doc.fontSize(12).font('Helvetica-Bold').text(`Day ${day.day}`);
        doc.font('Helvetica');
        (day.activities || []).forEach(act => {
          let timeStr = '';
          if (act.startTime && act.endTime) timeStr = `[${act.startTime} - ${act.endTime}] `;
          else if (act.time) timeStr = `[${act.time}] `;
          else if (act.startTime) timeStr = `[${act.startTime}] `;
          
          doc.text(`• ${timeStr}${act.activity || act.title}`);
          if (act.location) doc.text(`  Location: ${act.location}`);
          if (act.notes || act.description) doc.text(`  Notes: ${act.notes || act.description}`);
        });
        doc.moveDown();
      });
    }

    // Expense Summary
    doc.fontSize(14).font('Helvetica-Bold').text('Expense Summary', { underline: true });
    doc.font('Helvetica');
    doc.text(`Total Budget: ${trip.budget}`);
    doc.text(`Total Cost: ${totalCost}`);
    doc.text(`Remaining Budget: ${trip.budget - totalCost}`);
    doc.moveDown();
    if (expenseSummary.length > 0) {
      doc.text('Breakdown by Category:');
      expenseSummary.forEach(s => {
        doc.text(`- ${s._id}: ${s.total}`);
      });
    } else {
      doc.text('No expenses recorded.');
    }
    doc.moveDown();

    // Manager Suggestions
    doc.fontSize(14).font('Helvetica-Bold').text('Manager Suggestions', { underline: true });
    doc.font('Helvetica');
    if (suggestions.length === 0) {
      doc.text('No suggestions provided.');
    } else {
      suggestions.forEach(s => {
        doc.text(`• [${new Date(s.createdAt).toLocaleDateString()}] ${s.managerId?.name || 'Manager'}: ${s.message}`);
      });
    }

    // Finalize
    doc.end();

  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
