const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const PORT = 3000;
const users = require("./routes/users");
const auth = require("./routes/auth");
const map = require("./routes/map");
const groups = require("./routes/groups");
const events = require("./routes/events");
const scoreEvents = require("./recommendEvents/scoreEvents");
const mapAnalytics = require("./mapAnalytics/gridCluster");
const mapHistory = require("./mapAnalytics/mapHistory");
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: "noahMeta2025!",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/", users);
app.use("/", auth);
app.use("/", map);
app.use("/", groups);
app.use("/", events);
app.use("/", scoreEvents);
app.use("/", mapAnalytics);
app.use("/", mapHistory);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING & ONLINE @ ${PORT}`);
});
