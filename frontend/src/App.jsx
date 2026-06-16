import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import JobBoard from './pages/JobBoard/JobBoard';
import PostJob from './pages/PostJob/PostJob';
import ApplicationTracker from './pages/ApplicationTracker/ApplicationTracker';
import ApplicantReview from './pages/ApplicantReview/ApplicantReview';
import Interviews from './pages/Interviews/Interviews';

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
