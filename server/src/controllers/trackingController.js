import Tracking from '../models/Tracking.js';
import { serializeTracking } from '../utils/serialize.js';

// POST /api/tracking  (auth)
export async function createTracking(req, res, next) {
  try {
    const { category, quantity, weight, unit, notes } = req.body;
    if (!category) return res.status(400).json({ message: 'Category is required.' });

    const tracking = await Tracking.create({
      userId: req.user._id,
      category,
      quantity: quantity ?? 0,
      weight: weight ?? 0,
      unit: unit || 'kg',
      notes: notes || '',
    });
    res.status(201).json({ tracking: serializeTracking(tracking) });
  } catch (err) {
    next(err);
  }
}

// GET /api/tracking  (auth) — current user's tracking entries
export async function listTrackings(req, res, next) {
  try {
    const trackings = await Tracking.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ trackings: trackings.map(serializeTracking) });
  } catch (err) {
    next(err);
  }
}
