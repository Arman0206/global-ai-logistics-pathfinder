# 🌍 Global Logistics Pathfinder

**An AI-Powered Global Routing & Risk Assessment Engine**

## 📌 Overview
The Global Logistics Pathfinder is a full-stack routing application designed to simulate enterprise-level supply chain logistics. It calculates the most efficient multi-stop paths across international hubs and leverages artificial intelligence to provide real-time risk assessments for the journey.

## 🚀 Key Features
* **Custom Routing Engine:** Implements a proprietary graph traversal system using **Dijkstra’s Algorithm** to calculate optimal paths through a network of global logistics hubs.
* **Geospatial Mathematics:** Utilizes the **Haversine Formula** to dynamically calculate accurate real-world distances between user-defined GPS coordinates and static graph nodes.
* **AI-Generated Insights:** Integrates the **Groq SDK (Llama 3.1 8B)** to autonomously analyze the generated route and provide a two-sentence logistical summary and specific environmental/traffic warnings.
* **Interactive Visualization:** Uses **Leaflet.js** and **Nominatim OpenStreetMap** geocoding to map origin, destination, and intermediate hubs on a responsive global interface.

## 💻 Tech Stack
* **Backend:** Node.js, Express.js
* **Algorithms:** Dijkstra's Shortest Path, Haversine Distance Calculation
* **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Glassmorphism UI)
* **APIs & Data:** * Groq Cloud API (LLM Integration)
  * Nominatim API (Open-source Geocoding)
  * Leaflet.js (Map Rendering)

## ⚙️ Architecture & Algorithms
Unlike standard mapping tools that rely on pre-built Google APIs, this project demonstrates core Computer Science fundamentals:
1. **Dynamic Mapping:** User addresses are converted to lat/lon coordinates.
2. **Hub Snapping:** The system uses Haversine math to snap the user's local address to the nearest major international logistics hub.
3. **Graph Traversal:** Dijkstra's Algorithm evaluates edge weights (distances) across the global graph matrix to find the shortest hub-to-hub sequence.

## 🛠️ Installation & Setup

**1. Clone the repository**

bash

git clone [https://github.com/Arman0206/global-logistics-pathfinder.git](https://github.com/Arman0206/global-logistics-pathfinder.git)
cd global-logistics-pathfinder
2. Install dependencies

Bash
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add your Groq API Key:

Code snippet
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
4. Start the server

Bash
npm start
The application will be running at http://localhost:3000.

🔮 Future Improvements
Redis Caching: Implement memory caching for frequently searched routes to reduce API calls and improve latency.

Dynamic Hub Generation: Expand the static graph into a dynamically generated graph based on real-time port/airport traffic data.

Containerization: Add a Dockerfile for streamlined deployment and testing.
