import express from "express";
import bodyParser from "body-parser";
import path from "path";
import device from "express-device";
import { fileURLToPath } from "url";
import routes from "./routes";
import { errorHandler } from "./utils/errorHandler";
import { basicAuthCredentials, sessionSecret } from "./lib/variables";
import cookieParser from "cookie-parser";
import session from "express-session";
import { requireLogin } from "./utils/requireLogin_middleware";

const port = 3001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use('/public', express.static('public'));
app.use(device.capture());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
basicAuthCredentials && sessionSecret && app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(requireLogin);
app.get("/logout", function (req, res) {
  delete req.session.authStatus;
  res.redirect("/");
});

app.use(routes);
app.use(errorHandler);
app.listen(process.env.PORT || port, () => {
  console.log(
    `Start Server, visit http://localhost:${process.env.PORT || port}`
  );
});
