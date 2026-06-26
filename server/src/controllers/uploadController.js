// POST /api/upload  (auth)  — multipart form field `image`
export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  // Build an absolute URL so the frontend can render the image directly.
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename });
}
