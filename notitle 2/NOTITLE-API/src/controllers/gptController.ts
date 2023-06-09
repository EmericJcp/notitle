import express from "express";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const MAX_ATTEMPTS = 5;
const MAX_REGENERATIONS = 3;

const generateBookTitle = async (
  summary: string,
  lastBookTitle: string,
  attempt: number = 1
): Promise<string> => {
  if (attempt > MAX_ATTEMPTS) {
    throw new Error(
      "Could not generate a valid book title after multiple attempts. Could you please provide more information?"
    );
  }

  const prompt = lastBookTitle
    ? `On fait un jeu, je te dis quelques trucs, petit résumé pas complet sur un livre et toi tu dois retrouver le titre du livre d'accord ? Voilà ce que je t'écris : ${summary} Quand tu as trouvé tu dois juste écrire - titre du livre et rien d'autre. Cependant, je te demande un livre différent de ${lastBookTitle}`
    : `On fait un jeu, je te dis quelques trucs, petit résumé pas complet sur un livre et toi tu dois retrouver le titre du livre d'accord ? Voilà ce que je t'écris : ${summary} Quand tu as trouvé tu dois juste écrire - titre du livre et rien d'autre, réellement rien d'autre ne fait pas de phrase juste donne le titre du livre c'est très important !`;

  const gptResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  });

  if (
    gptResponse.data.choices &&
    gptResponse.data.choices.length > 0 &&
    gptResponse.data.choices[0].message
  ) {
    const title = gptResponse.data.choices[0].message.content.trim();
    if (title !== lastBookTitle) {
      return title;
    } else {
      return generateBookTitle(summary, lastBookTitle, attempt + 1);
    }
  } else {
    return generateBookTitle(summary, lastBookTitle, attempt + 1);
  }
};

export const getBookFromSummary = async (
  req: express.Request,
  res: express.Response
) => {
  let regenerationCount = 0;
  const { summary } = req.body;
  console.log("Summary:", summary);

  const lastSummary = req.cookies.lastSummary || "";
  let lastBookTitle = req.cookies.lastBookTitle || "";

  if (summary !== lastSummary) {
    lastBookTitle = "";
    res.cookie("lastBookTitle", "", { maxAge: 24 * 60 * 60 * 1000 });
  }

  try {
    const title = await generateBookTitle(summary, lastBookTitle);
    console.log("Book Title:", title);
    res.cookie("lastBookTitle", title, { maxAge: 24 * 60 * 60 * 1000 });
    res.cookie("lastSummary", summary, { maxAge: 24 * 60 * 60 * 1000 });

    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
    console.log("Google Books API URL:", url);

    const response = await axios.get(url);

    if (
      response.data.items &&
      response.data.items.length > 0 &&
      response.data.items[0].volumeInfo &&
      response.data.items[0].volumeInfo.title &&
      response.data.items[0].volumeInfo.authors &&
      response.data.items[0].volumeInfo.publishedDate &&
      response.data.items[0].volumeInfo.imageLinks &&
      response.data.items[0].volumeInfo.imageLinks.thumbnail &&
      response.data.items[0].volumeInfo.description
    ) {
      console.log("Google Books API Response:", response.data);
      res.json(response.data);
    } else {
      console.log("Some book information is missing");
      if (regenerationCount < MAX_REGENERATIONS) {
        regenerationCount++;
        getBookFromSummary(req, res);
      } else {
        res.status(400).send("Maximum regeneration limit reached");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Une erreur inconnue s'est produite");
    }
  }
};
