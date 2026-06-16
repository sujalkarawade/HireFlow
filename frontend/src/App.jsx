import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobBoard from './pages/JobBoard';
import PostJob from './pages/PostJob';
import ApplicationTracker from './pages/ApplicationTracker';
import ApplicantReview from './pages/ApplicantReview';
import Interviews from './pages/Interviews';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/applications" element={<ApplicationTracker />} />
          <Route path="/job-review/:jobId" element={<ApplicantReview />} />
          <Route path="/interviews" element={<Interviews />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
