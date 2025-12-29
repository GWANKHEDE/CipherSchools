import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssignmentList from './pages/AssignmentList';
import AssignmentAttempt from './pages/AssignmentAttempt';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.scss';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<AssignmentList />} />
                    <Route path="/attempt/:id" element={<AssignmentAttempt />} />
                </Routes>
                <ToastContainer position="bottom-right" />
            </div>
        </Router>
    );
}

export default App;
