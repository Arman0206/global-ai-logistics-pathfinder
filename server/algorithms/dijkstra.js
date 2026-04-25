// 1. The Priority Queue (Essential for Dijkstra's speed)
class PriorityQueue {
    constructor() { this.values = []; }
    enqueue(val, priority) { this.values.push({ val, priority }); this.sort(); }
    dequeue() { return this.values.shift(); }
    sort() { this.values.sort((a, b) => a.priority - b.priority); }
}

// 2. The Haversine Formula (Calculates real-world distance for edge weights)
function getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// 3. Our Global Logistics Network (The Graph)
const globalGraph = {
    'New York Hub': { lat: 40.7128, lon: -74.0060, connections: ['London Hub', 'Los Angeles Hub'] },
    'London Hub': { lat: 51.5074, lon: -0.1278, connections: ['New York Hub', 'Paris Hub', 'Berlin Hub'] },
    'Paris Hub': { lat: 48.8566, lon: 2.3522, connections: ['London Hub', 'Berlin Hub'] },
    'Berlin Hub': { lat: 52.5200, lon: 13.4050, connections: ['London Hub', 'Paris Hub', 'Tokyo Hub'] },
    'Los Angeles Hub': { lat: 34.0522, lon: -118.2437, connections: ['New York Hub', 'Tokyo Hub'] },
    'Tokyo Hub': { lat: 35.6762, lon: 139.6503, connections: ['Los Angeles Hub', 'Berlin Hub'] }
};

// Find the closest logistics hub to the user's specific address
function findNearestHub(lat, lon) {
    let nearest = null;
    let minDistance = Infinity;
    for (let hub in globalGraph) {
        let dist = getHaversineDistance(lat, lon, globalGraph[hub].lat, globalGraph[hub].lon);
        if (dist < minDistance) {
            minDistance = dist;
            nearest = hub;
        }
    }
    return nearest;
}

// 4. The Pathfinding Execution
module.exports = function(startNode, endNode) {
    // A. Map dynamic user input to our fixed graph
    const startHub = findNearestHub(startNode.lat, startNode.lon);
    const endHub = findNearestHub(endNode.lat, endNode.lon);

    // B. Standard Dijkstra Setup
    let distances = {};
    let nodes = new PriorityQueue();
    let previous = {};
    let path = [];

    for (let vertex in globalGraph) {
        if (vertex === startHub) {
            distances[vertex] = 0;
            nodes.enqueue(vertex, 0);
        } else {
            distances[vertex] = Infinity;
            nodes.enqueue(vertex, Infinity);
        }
        previous[vertex] = null;
    }

    // C. Dijkstra Execution
    while (nodes.values.length) {
        let smallest = nodes.dequeue().val;
        if (smallest === endHub) {
            while (previous[smallest]) {
                path.push(smallest);
                smallest = previous[smallest];
            }
            break;
        }

        if (smallest || distances[smallest] !== Infinity) {
            for (let neighbor of globalGraph[smallest].connections) {
                let neighborNode = globalGraph[neighbor];
                
                // Dynamic weight calculation using Haversine!
                let weight = getHaversineDistance(
                    globalGraph[smallest].lat, globalGraph[smallest].lon,
                    neighborNode.lat, neighborNode.lon
                );
                
                let candidate = distances[smallest] + weight;
                if (candidate < distances[neighbor]) {
                    distances[neighbor] = candidate;
                    previous[neighbor] = smallest;
                    nodes.enqueue(neighbor, candidate);
                }
            }
        }
    }

    // D. Compile the final route
    let finalPath = path.concat(startHub).reverse();
    
    // Build the visual coordinates array
    let pathCoords = [startNode]; 
    finalPath.forEach(hub => {
        pathCoords.push({ lat: globalGraph[hub].lat, lon: globalGraph[hub].lon, name: hub });
    });
    pathCoords.push(endNode);

    // Calculate total journey distance
    let totalDist = 0;
    for(let i = 0; i < pathCoords.length - 1; i++) {
        totalDist += getHaversineDistance(pathCoords[i].lat, pathCoords[i].lon, pathCoords[i+1].lat, pathCoords[i+1].lon);
    }

    return {
        names: pathCoords.map(n => n.name),
        coords: pathCoords,
        distance: totalDist.toFixed(2) + " km"
    };
};