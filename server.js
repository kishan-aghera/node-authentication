import express from "express";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const existUser = users.find(user => user.name == req.body.name);
    if ( existUser ) {
      return res.status(400).send('Already exists');
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
        name: req.body.name,
        password: hashedPassword
      }
      users.push(user);
      return res.sendStatus(201).send(user.name);
    }
  } catch {
    res.sendStatus(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.filter(user => user.name == req.body.name)[0];
  if (user == null) {
    return res.sendStatus(404).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.sendStatus(200).send(user.name);
    } else {
      res.sendStatus(403).send("Not Allowed");
    }
  } catch {
    res.sendStatus(500).send();
  }
});

app.listen(3000);
