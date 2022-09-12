const Err = require("../mw/err");
const bcrypt = require("bcrypt");
const { signIn, decode } = require("../utils/jwt");
const { tokens, users, tasks } = require("../src/data");
const router = require("express").Router();

const tokenProcces = (username) => {
  const token = signIn(username);
  const oldToken = tokens.filter(
    (loggedInUser) => loggedInUser.username === username
  );

  if (oldToken.length > 0) {
    //? { token:xxx, username } => { token:yyy, username }
    const arr = tokens.map((oldTokenUser) =>
      oldTokenUser.username === username ? { token, username } : oldTokenUser
    );
    tokens.splice(0, tokens.length, ...arr);
  } else tokens.push({ token, username }); //? { token:xxx, username:furkan }
  return token;
};

router.get("/", (req, res) => res.send("Welcome Api !!!"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new Err(400, "Username or password missing");
  }
  if (username.length < 6 || password.length < 6)
    throw new Err(400, "Username and password must be at least 6 characters");

  const user = users.find((user) => user.username === username);
  if (!user) throw new Err(400, "User not found");

  bcrypt.compare(password, user.password).then((result) => {
    if (!result) {
      next(new Err(400, "Password is incorrect"));
    } else {
      const token = tokenProcces(username);
      res.status(201).json({ token });
    }
  });
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new Err(400, "Username or password missing");
  }
  if (username.length < 6 || password.length < 6)
    throw new Err(400, "Username and password must be at least 6 characters");

  const user = users.find((user) => user.username === username);
  if (user) throw new Err(400, "Username already exists");

  bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash(password, salt).then((hashedPassword) => {
      users.push({ username, password: hashedPassword });
      const token = tokenProcces(username);
      res.status(201).json({ token });
    });
  });
});

router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Err(401, "Token is missing");
  
  const decodedToken = decode(token)
  const { username } = decodedToken;
  

  if (!username) throw new Err(401, "Unauthorized");

  const user = users.find((user) => user.username === username);
  if (!user) throw new Err(401, "User not found");

  const arr = users.filter((user) => user.username !== username);
  users.splice(0, users.length, ...arr);

  const filetered = tokens.filter((_token) => _token !== token);
  tokens.splice(0, tokens.length, ...filetered);

  res.status(201).json({ message: "Logout success" });
});

router.get("/all", (req, res) => {
  if (req.headers.authorization?.split(" ")[1] === process.env.ADMIN_PASSWORD)
    res.json({ tokens, users, tasks });
  else throw new Err(401, "Unauthorized");
});

module.exports = router;
