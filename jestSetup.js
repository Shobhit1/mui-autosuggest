const storage = {}
const storageImpl = {
  getItem: jest.fn().mockImplementation((key) => storage[key]),
  setItem: jest.fn().mockImplementation((key, jsonString) => {
    storage[key] = jsonString
  }),
  removeItem: jest.fn().mockImplementation((key) => {
    delete storage[key]
  }),
}

global.before = beforeAll
global.after = afterAll
global.context = describe
global.localStorage = storageImpl
global.sessionStorage = storageImpl

global.browserHistory = jest.mock('react-router', () => ({ browserHistory: { push: jest.fn() } }))

// mock xhr utility
jest.mock(
  'utils/xhr',
  () => ({
    get: () => Promise.resolve(),
    post: () => Promise.resolve(),
    put: () => Promise.resolve(),
    delete: () => Promise.resolve(),
  }),
  {
    virtual: true,
  }
)

mockCStackModules()
mockGStackModules()
