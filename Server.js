const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require("./config/database");

require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Note: Ensure authRoutes and professionalsRoutes exist in your /routes folder
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/professionals', require('./routes/professionalsRoutes'));

// Production - Serve React Build
if (process.env.NODE_ENV === 'production') {
  // Matches the "Frontend" folder name from your screenshot
  const buildPath = path.join(__dirname, '../Frontend/build');
  
  app.use(express.static(buildPath));

  /**
   * FIXED: Use '*' instead of '/*' 
   * This prevents the "PathError: Missing parameter name" on Railway/Node 22
   */
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
}

// 404 fallback (API only - handles routes that don't match above)
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});