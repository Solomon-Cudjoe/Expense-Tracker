import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// Start cron job to send GET request every 14 minutes

if (process.env.NODE_ENV === "production") {
  job.start();
}

//middlewares
app.use(ratelimiter);
app.use(express.json());

app.use("/api/transactions", transactionsRoutes);

const initDB = async () => {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE
        );
        `;
    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initDB(
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
);
