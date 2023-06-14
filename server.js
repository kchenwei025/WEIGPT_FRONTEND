import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

console.log("before", process.env.DATABASE_URL);
dotenv.config();
console.log("after", process.env.DATABASE_URL);
const port = 8000;
const app = express();
app.use(express.json());
app.use(cors());
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const API_KEY = process.env.API_KEY;
console.log(API_KEY);
app.use(express.static("src"));

app.get("/post", (req, res) => {
  db.query("SELECT * FROM post", []).then((result) => {
    res.send(result.rows);
  });
});

app.post("/post", async (req, res) => {
  const { role, chat } = req.body;

  if (!chat || !role) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    const result = await db.query(
      "INSERT INTO post(role, chat) VALUES ($1, $2) RETURNING *",
      [role, chat]
    );
    console.log(result.rows);

    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        // {
        //   role: "system",
        //   content:
        //     "You are an assistant who tells any random and very short fun fact about this Army. And you served in the Army for 15 years. Anything question people ask you , you find a way to relate back to Army.",
        // },
        // {
        //   role: "system",
        //   content:
        //     "Wei Chen is your friend from Army, when you hear Wei Chen, You will say wooah and followed by a past story",
        // },
        // {
        //   role: "system",
        //   content:
        //     "John is your god-level battle buddy, he excel in everything he does. When you hear his name, you will tell a wonderful story to praise him",
        // },
        // { role: "system", content: "Wei Chen once save your life" },
        { role: "system", content: req.body.system },
        { role: "user", content: req.body.message },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.send(data);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("port runing on " + port);
});
