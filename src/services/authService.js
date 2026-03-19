import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Set Firebase Auth persistence to LOCAL
setPersistence(auth, browserLocalPersistence);

export const authService = {
  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User full name
   * @param {string} phone - User phone number
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async signup(email, password, name, phone) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: name,
        phone: phone,
        location: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        reportsCount: 0,
        verifiedReportsCount: 0,
        profilePictureUrl: ''
      });

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          phone: phone,
          location: ''
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error.code)
      };
    }
  },

  /**
   * Sign in existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user data from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            name: userData.name,
            phone: userData.phone,
            location: userData.location,
            profilePictureUrl: userData.profilePictureUrl
          }
        };
      }

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error.code)
      };
    }
  },

  /**
   * Sign out current user
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error.code)
      };
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise<object|null>}
   */
  async getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            // Fetch user data from Firestore
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              resolve({
                uid: user.uid,
                email: user.email,
                name: userData.name,
                phone: userData.phone,
                location: userData.location,
                profilePictureUrl: userData.profilePictureUrl
              });
            } else {
              resolve({
                uid: user.uid,
                email: user.email,
                name: user.displayName
              });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
        unsubscribe();
      });
    });
  },

  /**
   * Update user profile
   * @param {object} data - User data to update (name, phone, location, etc.)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateUserProfile(data) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user authenticated' };
      }

      // Update Firebase Auth profile
      if (data.name) {
        await updateProfile(user, { displayName: data.name });
      }

      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...data,
        updatedAt: new Date()
      }, { merge: true });

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error.code)
      };
    }
  },

  /**
   * Subscribe to auth state changes
   * @param {function} callback - Callback function when auth state changes
   * @returns {function} Unsubscribe function
   */
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            callback({
              uid: user.uid,
              email: user.email,
              name: userData.name,
              phone: userData.phone,
              location: userData.location,
              profilePictureUrl: userData.profilePictureUrl
            });
          } else {
            callback({
              uid: user.uid,
              email: user.email,
              name: user.displayName
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  return messages[code] || 'Authentication failed. Please try again.';
}
