# Firebase Integration Guide for EcoAlert

This guide explains the Firebase setup and how to use each service in your EcoAlert application.

## 📋 Setup Overview

Your Firebase services are organized into 4 main service files:

1. **firebase.js** - Firebase initialization
2. **authService.js** - Authentication (signup, login, logout)
3. **firestoreService.js** - Database operations (reports, tracking)
4. **storageService.js** - Image upload handling

## 🔐 Authentication (`authService.js`)

### Signup
```javascript
import { authService } from './services/authService.js';

const result = await authService.signup(
  'user@example.com',
  'password123',
  'User Name',
  '+233 24 000 0000'
);

if (result.success) {
  console.log('Signup successful:', result.user);
}
```

### Login
```javascript
const result = await authService.login('user@example.com', 'password123');

if (result.success) {
  console.log('Logged in:', result.user);
}
```

### Logout
```javascript
const result = await authService.logout();
if (result.success) {
  console.log('Logged out successfully');
}
```

### Update Profile
```javascript
const result = await authService.updateUserProfile({
  name: 'New Name',
  phone: '+233 24 111 1111',
  location: 'Kumasi, Ghana'
});
```

### Subscribe to Auth State
```javascript
const unsubscribe = authService.onAuthStateChanged((user) => {
  if (user) {
    console.log('User logged in:', user);
  } else {
    console.log('User logged out');
  }
});

// Cleanup when component unmounts
return () => unsubscribe();
```

## 📊 Firestore Database (`firestoreService.js`)

### Create a Report
```javascript
import { firestoreService } from './services/firestoreService.js';

const result = await firestoreService.createReport({
  category: 'Plastic Waste',
  title: 'Plastic bags found at Accra Beach',
  description: 'Large pile of plastic waste',
  imageUrl: 'https://...',
  coordinates: {
    latitude: 5.3521,
    longitude: -0.2038
  },
  location: 'Accra Beach, Ghana'
});

if (result.success) {
  console.log('Report created:', result.reportId);
}
```

### Get All Reports
```javascript
const result = await firestoreService.getReports({
  status: 'pending', // Optional: filter by status
  limit: 20
});

if (result.success) {
  console.log('Reports:', result.reports);
}
```

### Get Single Report
```javascript
const result = await firestoreService.getReportById('report-id');

if (result.success) {
  console.log('Report:', result.report);
}
```

### Update Report Status
```javascript
const result = await firestoreService.updateReportStatus('report-id', 'verified');
```

### Delete Report
```javascript
const result = await firestoreService.deleteReport('report-id');
```

### Add Comment to Report
```javascript
const result = await firestoreService.addComment(
  'report-id',
  'This is a great observation!'
);
```

### Verify Report (Upvote)
```javascript
const result = await firestoreService.verifyReport('report-id');
```

### Waste Tracking

Create tracking entry:
```javascript
const result = await firestoreService.createTracking({
  category: 'Plastic Waste',
  quantity: 5,
  weight: 2.5,
  unit: 'kg',
  notes: 'Collected from beach'
});
```

Get user's tracking entries:
```javascript
const result = await firestoreService.getUserTrackings('user-id');

if (result.success) {
  console.log('Tracking entries:', result.trackings);
}
```

## 📸 Storage Service (`storageService.js`)

### Upload Image
```javascript
import { storageService } from './services/storageService.js';

const fileInput = document.getElementById('imageInput');
const file = fileInput.files[0];

const result = await storageService.uploadImage(file, 'reports');

if (result.success) {
  console.log('Image URL:', result.url);
}
```

### Upload Base64 Image
```javascript
const result = await storageService.uploadBase64Image(
  base64Data, // e.g., from canvas or camera
  'image/jpeg',
  'reports'
);

if (result.success) {
  console.log('Image URL:', result.url);
}
```

### Upload Profile Picture
```javascript
const result = await storageService.uploadProfilePicture(file);

if (result.success) {
  console.log('Profile picture URL:', result.url);
}
```

### Delete Image
```javascript
const result = await storageService.deleteImage('image-url');
```

### Get File Metadata
```javascript
const metadata = storageService.getImageMetadata(file);
console.log(metadata); // { name, size, type, formattedSize }
```

## 📱 ReportsService Integration (`reportsService.js`)

The main reports service combines Firestore and Storage:

### Create Report with Image
```javascript
import { createReport } from './services/reportsService.js';

const fileInput = document.getElementById('imageInput');
const file = fileInput.files[0];

const result = await createReport({
  category: 'Plastic Waste',
  title: 'Title here',
  description: 'Description here',
  coordinates: { latitude: 5.3521, longitude: -0.2038 },
  location: 'Accra, Ghana'
}, file);

if (result.success) {
  console.log('Report created:', result.reportId);
}
```

### Utility Functions
```javascript
import { 
  CATEGORIES,
  STATUS_CONFIG,
  getCategoryConfig,
  formatDate,
  reverseGeocode
} from './services/reportsService.js';

// Get category by label
const categoryConfig = getCategoryConfig('Plastic Waste');
console.log(categoryConfig); // { id, label, color, emoji }

// Format dates
console.log(formatDate(new Date())); // "2m ago"

// Reverse geocoding
const location = await reverseGeocode(5.3521, -0.2038);
console.log(location); // "Accra, Ghana"
```

## 🔍 Using in React Components

### With Hooks
```javascript
import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { getReports } from './services/reportsService';

function ReportsPage() {
  const { user, isLoading } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!isLoading && user) {
      loadReports();
    }
  }, [user, isLoading]);

  const loadReports = async () => {
    const result = await getReports({ limit: 20 });
    if (result.success) {
      setReports(result.reports);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      {reports.map(report => (
        <div key={report.id}>{report.title}</div>
      ))}
    </div>
  );
}
```

## 📲 Firebase Console

Your Firebase project: **ecoalert-e95e8**

Access at: [Firebase Console](https://console.firebase.google.com/)

### Key Collections in Firestore:
- **users** - User profiles and data
- **reports** - Waste reports
- **waste_tracking** - User's waste tracking entries

### Storage Paths:
- **reports/** - Report images
- **profile_pictures/** - User profile pictures

## ⚠️ Security Rules

Make sure your Firestore security rules allow:
- Authenticated users to read all reports
- Users to only write/delete their own reports
- Users to read/update their own profile

Example rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🛠️ Troubleshooting

### "User not authenticated" error
- Make sure user is logged in before making Firestore/Storage calls
- Check that auth state has loaded: `!isLoading && user`

### Image upload fails
- Check file size (max 10MB)
- Check file type (JPG, PNG, WebP only)
- Ensure user is authenticated

### Reports not updating in real-time
- Use `onSnapshot` from Firestore for real-time updates
- Currently, services use one-time reads

## 🚀 Next Steps

1. **Add real-time listeners** for reports and tracking
2. **Set up Cloud Functions** for automatic report verification
3. **Add notifications** using Cloud Messaging
4. **Setup authentication rules** in Firestore Security Rules
5. **Add analytics** tracking user engagement

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Storage Guide](https://firebase.google.com/docs/storage)
- [Authentication Guide](https://firebase.google.com/docs/auth)
