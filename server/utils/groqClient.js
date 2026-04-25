const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getDeliverySummary(path) {
    try {
        const response = await groq.chat.completions.create({
            messages: [{ 
                role: "user", 
                content: `Route: ${path.join(" ➔ ")}. Provide a 2-sentence logistics summary with one hypothetical traffic tip.` 
            }],
            // UPDATED MODEL NAME
            model: "llama-3.1-8b-instant", 
        });
        return response.choices[0].message.content;
    } catch (e) { 
        console.error("Groq API Error:", e.message);
        return "AI Summary is currently updating. Please try again in a moment."; 
    }
}

module.exports = { getDeliverySummary };