// Convert Mongoose documents into the JSON shape the frontend expects.
// Notably exposes `id` (string), a string `userId`, and convenience `lat`/`lng`
// derived from the coordinates object (used by the map view).

export function serializeReport(r) {
  return {
    id: r._id.toString(),
    userId: r.userId?._id ? r.userId._id.toString() : r.userId?.toString?.() ?? r.userId,
    category: r.category,
    title: r.title,
    description: r.description,
    imageUrl: r.imageUrl,
    coordinates: r.coordinates,
    lat: r.coordinates?.latitude,
    lng: r.coordinates?.longitude,
    location: r.location,
    status: r.status,
    verificationCount: r.verificationCount,
    upvotes: r.upvotes,
    downvotes: r.downvotes,
    comments: (r.comments || []).map((c) => ({
      userId: c.userId?.toString?.() ?? c.userId,
      userName: c.userName,
      text: c.text,
      createdAt: c.createdAt,
    })),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function serializeTracking(t) {
  return {
    id: t._id.toString(),
    userId: t.userId?.toString?.() ?? t.userId,
    category: t.category,
    quantity: t.quantity,
    weight: t.weight,
    unit: t.unit,
    notes: t.notes,
    date: t.date,
    createdAt: t.createdAt,
  };
}
