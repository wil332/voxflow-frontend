import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import LiveFeed from "./pages/LiveFeed";
import AudioEngine from "./pages/AudioEngine";
import NewProject from "./pages/NewProject";
import Login from "./pages/Login";
import { PipelineProvider } from "./context/PipelineProvider";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History";

function App() {
  return (
    <AuthProvider>
      <PipelineProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Route yang Dilindungi Auth */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/live-feed"
              element={
                <ProtectedRoute>
                  <LiveFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/audio-engine"
              element={
                <ProtectedRoute>
                  <AudioEngine />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard/history" element={
              <ProtectedRoute>
                  <History />
                </ProtectedRoute>} />
            <Route
              path="/dashboard/new-project"
              element={
                <ProtectedRoute>
                  <NewProject />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </PipelineProvider>
    </AuthProvider>
  );
}

export default App;