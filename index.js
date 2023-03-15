const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const Person = require("./models");

require("dotenv/config");

const app = express();

app.use(cors());

app.use(express.static("frontend"));

app.use(express.json());
app.use(morgan("tiny"));

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

//Connect to db
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_CONNECT_URL);

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find();

    res.json(persons);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.get("/api/persons/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const person = await Person.findById(id);
    res.json(person);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.delete("/api/persons/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const person = await Person.deleteOne({ _id: id });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.post("/api/persons", async (req, res) => {
  const body = req.body;

  if (!body.name) {
    res.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    res.status(400).json({
      error: "number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

    try {
        const savedPerson = await person.save();
        res.json(savedPerson);
        } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

app.put("/api/persons/:id", async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        const updatedPerson = await Person.updateOne({ _id: id }, { number: body.number });
        const person = await Person.findById(id);
        res.json(person);
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

app.get("/info", async (req, res) => {
    const date = new Date();
    try {
        const persons = await Person.find();
        res.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
        );
    } catch (error) {
        res.status(400).json({
        error: error.message,
        });
    }

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
