/* eslint-disable no-unused-vars */
const express = require("express");
const db = require("./models/index");
const app = express();
var bodyParser = require("body-parser");
const path = require("path");
var csurf = require("tiny-csrf");
var cookieParser = require("cookie-parser");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const flash = require("connect-flash");

// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname, "views"));
app.use(flash());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("ssh! some secret string"));
app.use(csurf("123456789iamasecret987654321look", ["POST", "PUT", "DELETE"]));

app.use(
  session({
    secret: "my-super-secret-key-21762849894349",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      db.TodoUser.findOne({ where: { email: username } })
        .then(async (user) => {
          if (!user)
            return done(null, false, {
              message: "No user found with given email address",
            });
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          return error;
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serialiing user in session", user.id);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  db.TodoUser.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

app.get("/signup", async (request, response) => {
  return response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});

app.get("/login", async (request, response) => {
  return response.render("login", {
    title: "Login",
    csrfToken: request.csrfToken(),
  });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (request, response) => {
    response.redirect("/todos");
  }
);

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) return next(err);
    response.redirect("/");
  });
});

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  try {
    const user = await db.TodoUser.create({
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) console.log(err);
      else return response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
    response.json(error).status(422);
  }
});

app.get("/", async (request, response) => {
  return response.render("index", {
    title: "Todo Application",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    // const allTodos = await db.Todos.getTodos();
    const completed = await db.Todos.completed(request.user.id);
    const overdue = await db.Todos.overdue(request.user.id);
    const dueToday = await db.Todos.dueToday(request.user.id);
    const dueLater = await db.Todos.dueLater(request.user.id);
    if (request.accepts("html")) {
      return response.render("todos", {
        title: "Todo Application",
        completed,
        overdue,
        dueToday,
        dueLater,
        csrfToken: request.csrfToken(),
      });
    } else {
      return response.json({ completed, overdue, dueToday, dueLater });
    }
  }
);

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Creating a new Todo ...", request.user);
    try {
      await db.Todos.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Updating Todo with ID: ", request.params.id);
    const todo = await db.Todos.findByPk(request.params.id);

    try {
      const updatedTodo = await todo.setCompletionStatus(
        request.body.completed,
        request.user.id
      );
      if (request.accepts("html")) return response.json(updatedTodo);
      else return response.redirect("/");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Deleting todo with ID: ", request.params.id);
    try {
      const todo = await db.Todos.findByPk(request.params.id);
      if (todo) {
        await db.Todos.remove(request.params.id, request.user.id);
        return response.json(true);
      } else {
        return response.json(false);
      }
    } catch (error) {
      console.log(error);
      return response.status(422).json(false);
    }
  }
);

module.exports = app;
