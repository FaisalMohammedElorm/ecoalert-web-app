import Report from '../models/Report.js';
import User from '../models/User.js';
import { isAdmin } from '../middleware/admin.js';
import { serializeReport } from '../utils/serialize.js';

// GET /api/reports?status=&userId=&category=&limit=
export async function listReports(req, res, next) {
  try {
    const {
      status, userId, category,
      page = 1, limit = 50,
      minLat, maxLat, minLng, maxLng,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (category) filter.category = category;

    // Bounding box filter for map views: prefer GeoJSON `geo` queries for
    // performance; fall back to legacy numeric `coordinates` field if `geo`
    // isn't populated yet for some documents.
    if (minLat !== undefined && maxLat !== undefined && minLng !== undefined && maxLng !== undefined) {
      const box = [[Number(minLng), Number(minLat)], [Number(maxLng), Number(maxLat)]];
      filter.$or = [
        { geo: { $geoWithin: { $box: box } } },
        { 'coordinates.latitude': { $gte: Number(minLat), $lte: Number(maxLat) }, 'coordinates.longitude': { $gte: Number(minLng), $lte: Number(maxLng) } },
      ];
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Number(limit) || 50, 200);

    const total = await Report.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage);

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .exec();

    res.json({
      reports: reports.map(serializeReport),
      meta: { total, page: pageNum, perPage, totalPages },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/:id
export async function getReport(req, res, next) {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    res.json({ report: serializeReport(report) });
  } catch (err) {
    next(err);
  }
}

// POST /api/reports  (auth)
export async function createReport(req, res, next) {
  try {
    const { category, title, description, imageUrl, coordinates, location } = req.body;
    if (!category) return res.status(400).json({ message: 'Category is required.' });

    const geoPoint = (coordinates && typeof coordinates.latitude === 'number' && typeof coordinates.longitude === 'number')
      ? { type: 'Point', coordinates: [coordinates.longitude, coordinates.latitude] }
      : undefined;

    const report = await Report.create({
      userId: req.user._id,
      category,
      title: title || '',
      description: description || '',
      imageUrl: imageUrl || '',
      coordinates: {
        latitude: coordinates?.latitude ?? 0,
        longitude: coordinates?.longitude ?? 0,
      },
      geo: geoPoint,
      location: location || '',
    });

    await User.updateOne({ _id: req.user._id }, { $inc: { reportsCount: 1 } });
    res.status(201).json({ report: serializeReport(report) });
  } catch (err) {
    next(err);
  }
}

// PUT /api/reports/:id/status  (auth: owner or admin)
export async function updateReportStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['pending', 'verified', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    const owner = report.userId.toString() === req.user._id.toString();
    if (!owner && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Not allowed to update this report.' });
    }

    const wasVerified = report.status === 'verified';
    report.status = status;
    await report.save();

    // Increment the report owner's verified count the first time it becomes verified.
    if (status === 'verified' && !wasVerified) {
      await User.updateOne({ _id: report.userId }, { $inc: { verifiedReportsCount: 1 } });
    }

    res.json({ report: serializeReport(report) });
  } catch (err) {
    next(err);
  }
}

// PUT /api/reports/:id  (auth: owner or admin)
export async function updateReport(req, res, next) {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    const owner = report.userId.toString() === req.user._id.toString();
    if (!owner && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Not allowed to update this report.' });
    }

    const allowed = ['category', 'title', 'description', 'imageUrl', 'coordinates', 'location'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) report[key] = req.body[key];
    }

    // If coordinates are provided or updated, set the `geo` Point accordingly
    if (req.body.coordinates && typeof req.body.coordinates.latitude === 'number' && typeof req.body.coordinates.longitude === 'number') {
      report.geo = { type: 'Point', coordinates: [req.body.coordinates.longitude, req.body.coordinates.latitude] };
    }

    await report.save();
    res.json({ report: serializeReport(report) });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/reports/:id  (auth: owner or admin)
export async function deleteReport(req, res, next) {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    const owner = report.userId.toString() === req.user._id.toString();
    if (!owner && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Not allowed to delete this report.' });
    }

    await report.deleteOne();
    await User.updateOne({ _id: report.userId }, { $inc: { reportsCount: -1 } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// POST /api/reports/:id/verify  (auth)  — community upvote/verify
export async function verifyReport(req, res, next) {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1, verificationCount: 1 } },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    res.json({ report: serializeReport(report) });
  } catch (err) {
    next(err);
  }
}

// POST /api/reports/:id/comments  (auth)
export async function addComment(req, res, next) {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Comment text is required.' });

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    report.comments.push({
      userId: req.user._id,
      userName: req.user.name || 'Anonymous',
      text: text.trim(),
    });
    await report.save();
    res.status(201).json({ report: serializeReport(report) });
  } catch (err) {
    next(err);
  }
}
