import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAssignments } from '../api';

const AssignmentList = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAssignments = async () => {
            try {
                const { data } = await fetchAssignments();
                setAssignments(data);
            } catch (err) {
                console.error('Error fetching assignments:', err);
            } finally {
                setLoading(false);
            }
        };
        getAssignments();
    }, []);

    if (loading) return <div className="container">Loading assignments...</div>;

    return (
        <div className="container">
            <header className="header">
                <h1>CipherSQLStudio</h1>
                <p>Master SQL with real-time practice and AI guidance.</p>
            </header>
            <main className="main-content">
                <h2>Available Assignments</h2>
                <div className="assignment-grid">
                    {assignments.map((assignment) => (
                        <div key={assignment._id} className="assignment-card">
                            <span className="assignment-card__difficulty">{assignment.difficulty}</span>
                            <h3 className="assignment-card__title">{assignment.title}</h3>
                            <p className="assignment-card__description">{assignment.question}</p>
                            <Link to={`/attempt/${assignment._id}`} className="btn btn--primary">
                                Attempt Assignment
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AssignmentList;
