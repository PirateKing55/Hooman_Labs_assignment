import express from 'express';
import cors from 'cors';
import path from 'path';

import { rootRouter } from './app/routes/routes.js';
import { staticRouter } from './app/routes/staticRoute.js';

const PORT = process.env.PORT || 3000;

const app = express();

// Setting the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./app/shop"));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/", staticRouter);
app.use('/app/api', rootRouter);

// Global error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
