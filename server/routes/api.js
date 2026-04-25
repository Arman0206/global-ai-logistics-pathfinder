const express = require('express');
const router = express.Router();
const calculatePath = require('../algorithms/dijkstra');
const { getDeliverySummary } = require('../utils/groqClient');

router.post('/calculate-route', async (req, res) => {
    try {
        const { start, end } = req.body; 
        
        console.log(`\n--- New Request Received ---`);
        // This line proves the new code is running by extracting the names
        console.log(`Step 1: Route requested from ${start.name} to ${end.name}`);

        // 1. Calculate Path
        const result = calculatePath(start, end);
        console.log('Step 2: Path calculated ->', result.names.join(' to '));

        // 2. Get AI Summary (Passing the clean strings to the AI)
        console.log('Step 3: Calling Groq AI...');
        const summary = await getDeliverySummary(result.names);
        console.log('Step 4: AI Summary received!');
        
        // 3. Send everything back to the frontend
        res.json({ 
            path: result.names, 
            coords: result.coords,
            distance: result.distance, 
            summary: summary 
        });
    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;