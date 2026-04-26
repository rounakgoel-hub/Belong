import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LandingScreen from './components/screens/LandingScreen'
import MapScreen from './components/screens/MapScreen'
import AllStoriesScreen from './components/screens/AllStoriesScreen'
import ToastManager from './components/ui/ToastManager'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <ToastManager />
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/stories" element={<AllStoriesScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
