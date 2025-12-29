const axios = require('axios');

exports.generateHint = async (assignment, currentQuery) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return "Hint service unavailable (Missing API Key).";
        }

        const schemaDescription = assignment.sampleTables
            ? assignment.sampleTables.map(t => {
                if (!t.columns) return `${t.tableName} (structure unknown)`;
                return `${t.tableName} (${t.columns.map(c => c.columnName).join(', ')})`;
            }).join('; ')
            : 'Not provided';

        const prompt = `
            You are a SQL teaching assistant. 
            The student is working on the following assignment:
            Title: ${assignment.title}
            Description: ${assignment.description}
            Schema: ${schemaDescription}
            
            The student's current query is: "${currentQuery || 'None yet'}"
            
            Provide a helpful hint to guide the student toward the correct SQL solution.
            CRITICAL: Do NOT provide the full SQL solution. Do NOT provide code snippets that solve the problem completely.
            Focus on logic, keywords (like GROUP BY, JOIN, WHERE), or conceptual mistakes.
            Keep the response concise (max 3 sentences).
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return response.data.candidates[0].content.parts[0].text;
        }

        return "Unable to generate hint.";

    } catch (error) {
        if (error.response && error.response.status === 429) {
            return "AI Rate limit exceeded. Please wait a minute and try again.";
        }
        console.error('Hint API Error:', error.message);
        return "Unable to generate a hint at this time.";
    }
};
