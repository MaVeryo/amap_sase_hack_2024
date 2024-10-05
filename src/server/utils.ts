import { Job } from "../types/job.js";
import puppeteer from "puppeteer";
import OpenAI from "openai";
// const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

/**
 * Takes a link to a job posting, scrapes the page, and returns the job information.
 * @param link the link to the job posting
 * @returns the job information
 */
export async function getJobInfoFromLink( link: string ): Promise<Job> {
    let job: Job = {
        _id: '',
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        link: link
    };

    // Scrape the page
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(link);      // TODO: input sanitization/validation to make sure the link is valid

    // Get the job information
    const pageInfo = await page.evaluate(() => {
        return {page: document.querySelector('html')?.textContent};
    });
    await browser.close();

    // send the job information to Google Cloud NLP to get the job description


    return job;
}

// const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: "Write a haiku about recursion in programming.",
//         },
//     ],
// });
//
// console.log(completion.choices[0].message);