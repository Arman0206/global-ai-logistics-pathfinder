const map = L.map('map').setView([20, 0], 2); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let markers = [];
let pathLine = null;

async function calculateGlobalRoute() {
    const startCity = document.getElementById('start-city').value;
    const endCity = document.getElementById('end-city').value;
    const btnText = document.getElementById('btn-text');
    const loader = document.getElementById('loader');
    const status = document.getElementById('status-badge');

    if (!startCity || !endCity) return alert("Please enter both locations.");

    // UI Start Loading
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    status.innerText = "🔍 Geocoding Locations...";

    try {
        // 1. Get Coordinates from Nominatim (Free)
        const start = await getCoords(startCity);
        const end = await getCoords(endCity);

        status.innerText = "🤖 Groq AI Analyzing Path...";

        // 2. Call Backend
        const response = await fetch('/api/calculate-route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start, end })
        });
        const result = await response.json();

        // 3. Render Visuals
       /* renderMap(start, end);
        document.getElementById('route-path').innerText = `${start.name.split(',')[0]} ➔ ${end.name.split(',')[0]}`;
        document.getElementById('ai-insight').innerText = result.summary;
        status.innerText = "✅ Optimization Complete";*/
        // 3. Render Visuals (pass the WHOLE array, not just start and end)
        document.getElementById('route-path').innerText = `${result.distance} | ${result.path.join(' ➔ ')}`;
        document.getElementById('ai-insight').innerText = result.summary;
        
        // Pass the entire coords array to the map
        renderMap(result.coords);

    } catch (err) {
        console.error(err);
        status.innerText = "❌ System Error";
        alert("Failed to calculate route: " + err.message);
    } finally {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
}

async function getCoords(city) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
    const data = await res.json();
    if (data.length === 0) throw new Error(`Location not found: ${city}`);
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name };
}

function renderMap(coordsArray) {
    // Clear old layers
    markers.forEach(m => map.removeLayer(m));
    if (pathLine) map.removeLayer(pathLine);
    markers = [];

    // Extract lat/lon pairs for the polyline
    const latlngs = coordsArray.map(c => [c.lat, c.lon]);

    // Draw the multi-stop line
    pathLine = L.polyline(latlngs, {
        color: '#4f46e5',
        weight: 4,
        dashArray: '10, 10',
        opacity: 0.8
    }).addTo(map);

    // Add a marker for every single stop (Origin, Hubs, Destination)
    coordsArray.forEach((coord, index) => {
        let label = "Hub: " + coord.name;
        if (index === 0) label = "Origin: " + coord.name;
        if (index === coordsArray.length - 1) label = "Destination: " + coord.name;
        
        let m = L.marker([coord.lat, coord.lon]).addTo(map).bindPopup(label);
        markers.push(m);
    });

    // Zoom the map to fit the entire journey
    map.fitBounds(pathLine.getBounds(), { padding: [50, 50] });
}