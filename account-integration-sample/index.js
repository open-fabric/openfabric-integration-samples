import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes";
import { errorHandler } from "./utils/errorHandler";
const port = 3001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use(errorHandler);
app.listen(process.env.PORT || port, () => {
  console.log(
    `Start Server, visit http://localhost:${process.env.PORT || port}`
  );
});
