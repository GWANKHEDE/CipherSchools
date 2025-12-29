const { sandboxPool } = require('../config/db');

exports.executeSQL = async (query) => {
    const destructiveCommands = ['DROP', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'GRANT', 'REVOKE'];
    const upperQuery = query.toUpperCase();

    if (destructiveCommands.some(cmd => upperQuery.includes(cmd))) {
        throw new Error('Only SELECT queries are allowed in this sandbox.');
    }

    const result = await sandboxPool.query(query);
    return {
        columns: result.fields.map(f => f.name),
        rows: result.rows,
        rowCount: result.rowCount
    };
};
