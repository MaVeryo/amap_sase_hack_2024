import Groq from "groq-sdk";
import * as dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  const chatCompletion = await groq.chat.completions.create({
        messages: [{
            role: "user",
            content: "bake me a cake"
        }],
        model:"llama-3.1-8b-instant"
  });
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0].message.content);
}

main();