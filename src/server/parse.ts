import {
    LlamaParseReader,
    // we'll add more here later
} from "llamaindex";
import dotenv from 'dotenv';

// Adjust the path to your .env file if it's located outside the current directory
dotenv.config({ path: '../../.env' }); 

console.log('Loaded API key:', process.env.LLAMA_API_KEY); // Add this to verify


async function main() {
    // Access the API key from the .env file
    const apiKey = process.env.LLAMA_API_KEY;

    if (!apiKey) {
        throw new Error("API key is missing! Please check your .env file.");
    }

    // save the file linked above as sf_budget.pdf, or change this to match
    const path = "canada.pdf";

    // set up the llamaparse reader with the API key
    const reader = new LlamaParseReader({
        resultType: "markdown",
        apiKey: apiKey,  // Add the API key here
    });

    // parse the document
    const documents = await reader.loadData(path);

    // print the parsed document
    console.log(documents);
}

main().catch(console.error);
