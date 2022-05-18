import express from "express";
import bodyParser from "body-parser";
import path from "path";
import device from "express-device";
import { fileURLToPath } from "url";
import routes from "./routes";
import { errorHandler } from "./utils/errorHandler";
import { basicAuthCredentials } from "./lib/variables";
import cookieParser from 'cookie-parser'
import session from 'express-session'
const port = 3001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(device.capture());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET }));

if (basicAuthCredentials) {
  const basicAuthUser = basicAuthCredentials.split(":")[0];
  const basicAuthPass = basicAuthCredentials.split(":")[1];
  app.use(function (req, res, next) {
    if (!req.session.authStatus || "loggedOut" === req.session.authStatus) {
      req.session.authStatus = "loggingIn";

      // cause Express to issue 401 status so browser asks for authentication
      req.user = false;
      req.remoteUser = false;
      if (req.headers && req.headers.authorization) {
        delete req.headers.authorization;
      }
    }
    next();
  });
  app.use(
    express.basicAuth(function (user, pass, callback) {
      callback(null, user === basicAuthUser && pass === basicAuthPass);
    }, "Please enter username and password to access this page")
  );
  app.use(function (req, res, next) {
    req.session.authStatus = "loggedIn";
    next();
  });
}

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
