import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { fetchAssignmentById, executeQuery, getHint } from '../api';
import { toast } from 'react-toastify';

const AssignmentAttempt = () => {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('SELECT * FROM customers;');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hint, setHint] = useState('');
    const [hintLoading, setHintLoading] = useState(false);

    useEffect(() => {
        const getAssignment = async () => {
            try {
                const { data } = await fetchAssignmentById(id);
                setAssignment(data);
            } catch (err) {
                toast.error('Failed to load assignment.');
            }
        };
        getAssignment();
    }, [id]);

    const handleExecute = async () => {
        setLoading(true);
        setResults(null);
        try {
            const { data } = await executeQuery(query);
            setResults(data);
            toast.success('Query executed successfully!');
        } catch (err) {
            // Error handled by interceptor, but good to have safety
        } finally {
            setLoading(false);
        }
    };

    const handleGetHint = async () => {
        setHintLoading(true);
        try {
            const { data } = await getHint(assignment, query);
            setHint(data.hint);
        } catch (err) {
            toast.error('Failed to get hint.');
        } finally {
            setHintLoading(false);
        }
    };

    if (!assignment) return <div className="container">Loading assignment...</div>;

    return (
        <div className="container assignment-page">
            <Link to="/" className="btn" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Assignments</Link>

            <div className="layout-grid">
                <section className="panel question-panel">
                    <h2>{assignment.title}</h2>
                    <p className="assignment-desc">{assignment.description}</p>

                    <div className="schema-box">
                        <h4>Database Schema</h4>
                        {assignment.sampleTables ? (
                            <div className="schema-list">
                                {assignment.sampleTables.map(t => (
                                    <div key={t.tableName}>
                                        <strong>{t.tableName}</strong>: {t.columns.map(c => c.columnName).join(', ')}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <pre>{assignment.schema_description}</pre>
                        )}
                    </div>

                    {assignment.sampleTables && (
                        <div className="sample-data-box">
                            <h4>Sample Data</h4>
                            {assignment.sampleTables.map((tableData) => (
                                <div key={tableData.tableName} className="table-preview">
                                    <h5>{tableData.tableName}</h5>
                                    <div className="table-wrapper mini-table">
                                        <table className="result-table">
                                            <thead>
                                                <tr>
                                                    {tableData.columns.map(col => <th key={col.columnName}>{col.columnName}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Only show first 5 rows */}
                                                {(tableData.rows || []).slice(0, 5).map((row, i) => (
                                                    <tr key={i}>
                                                        {tableData.columns.map(col => <td key={col.columnName}>{row[col.columnName]}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {hint && (
                        <div className="hint-box">
                            <strong>💡 Hint:</strong>
                            <p>{hint}</p>
                        </div>
                    )}
                    <button
                        className="btn btn--secondary"
                        onClick={handleGetHint}
                        disabled={hintLoading}
                    >
                        {hintLoading ? 'Thinking...' : 'Get AI Hint'}
                    </button>
                </section>

                <section className="panel editor-panel">
                    <div className="editor-header">
                        <h3>SQL Editor</h3>
                        <button
                            className="btn btn--primary"
                            onClick={handleExecute}
                            disabled={loading}
                        >
                            {loading ? 'Executing...' : 'Run Query'}
                        </button>
                    </div>

                    <div className="editor-container">
                        <Editor
                            height="400px"
                            language="sql"
                            theme="vs-dark"
                            value={query}
                            onChange={(value) => setQuery(value)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                            }}
                        />
                    </div>

                    <div className="results-container">
                        <h3>Results</h3>
                        {!results ? (
                            <p className="no-results">Run a query to see results here.</p>
                        ) : (
                            <div className="table-wrapper">
                                <table className="result-table">
                                    <thead>
                                        <tr>
                                            {results.columns.map((col) => (
                                                <th key={col}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.rows.map((row, i) => (
                                            <tr key={i}>
                                                {results.columns.map((col) => (
                                                    <td key={col}>{row[col]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="row-count">{results.rowCount} rows returned.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AssignmentAttempt;
