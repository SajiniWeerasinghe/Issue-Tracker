import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import IssueList from './components/IssueList.jsx';
import IssueDetails from './components/IssueDetails.jsx';
import IssueCreate from './components/IssueCreate.jsx';
import IssueEdit from './components/IssueEdit.jsx';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={user ? <IssueList /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/issues/:id"
          element={user ? <IssueDetails /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/issues/create"
          element={
            <ProtectedRoute>
              <IssueCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/edit/:id"
          element={
            <ProtectedRoute>
              <IssueEdit />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
