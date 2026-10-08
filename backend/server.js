const app = require("./app.js");

const PORT = 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
