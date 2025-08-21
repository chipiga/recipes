import '@testing-library/jest-dom'

// Mock Firebase
vi.mock('./firebase', () => ({
  default: {
    auth: {
      onAuthStateChanged: vi.fn(),
      signInWithEmailAndPassword: vi.fn(),
      createUserWithEmailAndPassword: vi.fn(),
      signOut: vi.fn(),
    },
    firestore: {
      collection: vi.fn(),
      doc: vi.fn(),
      addDoc: vi.fn(),
      updateDoc: vi.fn(),
      deleteDoc: vi.fn(),
      getDocs: vi.fn(),
      getDoc: vi.fn(),
      query: vi.fn(),
      where: vi.fn(),
      orderBy: vi.fn(),
      limit: vi.fn(),
    },
  },
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: '/' }),
  }
})

// Mock react-redux
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux')
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: () => vi.fn(),
  }
})
