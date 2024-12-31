const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("Ecommerce_Db", "postgres", "8908576665", {
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    acquire: 30000, // Maximum time (in ms) to wait before a connection is established
    idle: 10000, // Maximum time (in ms) a connection can be idle before being released
  },
});

// Function to test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate(); // Attempt to connect to the database
    console.log("Connection has been established successfully."); // Success message
  } catch (error) {
    console.error("Unable to connect to the database:", error); // Error message
  }
}

testConnection();
module.exports = sequelize;
