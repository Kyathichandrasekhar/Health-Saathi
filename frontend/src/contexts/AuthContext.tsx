import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
  User,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

export type OAuthProviderType = 'google' | 'github' | 'facebook' | 'apple' | 'microsoft'

interface AuthContextType {
  user: User | null
  role: 'user' | 'admin' | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: 'user' | 'admin') => Promise<void>
  loginWithOAuth: (providerName: OAuthProviderType, role?: 'user' | 'admin') => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  loginWithOAuth: async () => {},
  logout: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<'user' | 'admin' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            setRole(userDoc.data().role || 'user')
          } else {
            setRole('user')
          }
        } catch {
          setRole('user')
        }
      } else {
        setRole(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email: string, password: string, name: string, role: 'user' | 'admin') => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })
    // Store user info in Firestore
    await setDoc(doc(db, 'users', credential.user.uid), {
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    })
    setRole(role)
  }

  const loginWithOAuth = async (providerName: OAuthProviderType, defaultRole: 'user' | 'admin' = 'user') => {
    let provider: any
    
    switch (providerName) {
      case 'google': provider = new GoogleAuthProvider(); break
      case 'github': provider = new GithubAuthProvider(); break
      case 'facebook': provider = new FacebookAuthProvider(); break
      case 'apple': provider = new OAuthProvider('apple.com'); break
      case 'microsoft': provider = new OAuthProvider('microsoft.com'); break
      default: throw new Error('Unsupported provider')
    }

    try {
      const result = await signInWithPopup(auth, provider)
      
      // Check if user already exists in Firestore
      const userDocRef = doc(db, 'users', result.user.uid)
      const userDocSnap = await getDoc(userDocRef)
      
      if (!userDocSnap.exists()) {
        // Create new user profile in Firestore
        await setDoc(userDocRef, {
          name: result.user.displayName || `${providerName} User`,
          email: result.user.email || '',
          role: defaultRole,
          createdAt: new Date().toISOString(),
        })
        setRole(defaultRole)
      } else {
        setRole(userDocSnap.data()?.role || 'user')
      }
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error(`The ${providerName} login method is not enabled in your Firebase console.`)
      }
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, signup, loginWithOAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
