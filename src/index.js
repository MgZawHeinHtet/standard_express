import app from "./app.js";
import { configDotenv } from "dotenv";
import { connectDB } from "./db/index.js";

configDotenv({
  path: ".env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at port : http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
