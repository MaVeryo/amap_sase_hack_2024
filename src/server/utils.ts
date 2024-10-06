import { createEmptyJob, Job } from "../types/job.js";
import puppeteer from "puppeteer";
import { ObjectId } from "mongodb";
import fs from 'fs';
import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

/**
 * Takes a link to a job posting, scrapes the page, and returns the job information.
 * @param link the link to the job posting
 * @returns the job information
 */
export async function getJobInfoFromLink( link: string ): Promise<Job | null> {
    let job: Job | null = createEmptyJob(link);
    let html;

    // Scrape the page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link, {
        waitUntil: 'domcontentloaded',
    });      // TODO: input sanitization/validation to make sure the link is valid
    await page.waitForNetworkIdle().then(async _ => html = await page.content());  // Wait for the page to load
    await browser.close();

    // Get the job information
    if (!html) {
        return null;
    }

    job = await parseJob(html, link);
    if (!job) {
        job = parseWorkdayJob(html, link);
    }

    return job;
}

/**
 * Cleans the html of the page by removing unnecessary elements.
 * @param html the html of the page
 * @returns the cleaned html
 */
function cleanHtml( html: string ): string {
    // remove scripts and styles
    html = html.replace(/<script.*?>.*?<\/script>/gs, '');
    html = html.replace(/<style.*?>.*?<\/style>/gs, '');

    // remove comments
    html = html.replace(/<!--.*?-->/gs, '');

    // remove doctype
    html = html.replace(/<!DOCTYPE.*?>/gs, '');

    // remove all attributes from tags
    html = html.replace(/<([a-z][a-z0-9]*)[^>]*>/gi, '<$1>');

    return html;
}

/**
 * Parses the job information from the page.
 * @param html the html of the page
 * @param link the link to the page
 * @returns the job information
 */
async function parseJob( html: string, link: string ): Promise<Job | null> {
    // TODO: implement this function
    const job: Job = createEmptyJob(link);
    html = cleanHtml(html);

    let response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Your task is to parse the job information from the following page. " +
                         "You should return the information in the following JSON format: " +
                         "{title: 'Job Title', company: 'Company Name', location: 'Location', description: 'Job Description', salary: 'Salary', datePosted: 'Date Posted', employmentType: 'Employment Type', status: 'Status'}." +
                         "If you are unable to find any of the information, you can set it to 'Not found'." +
                         "Do not include any other information or text." +
                         "PAGE: " + html,
            },
        ],
        model: "llama3-8b-8192",
    });

    if (!response || !response.choices || !response.choices[0]?.message?.content) {
        return null;
    }


    // I don't trust the AI to not add any extra information, so this just gets the text between the curly braces
    const regex = /{([^}]*)}/;
    let match = response.choices[0]?.message?.content.match(regex) || "{}";
    match = match[0].replace(/'/g, ' ');
    console.log(match);
    job.title = JSON.parse(match).title.replace(/&amp;/g, '&');
    job.company = JSON.parse(match).company.replace(/&amp;/g, '&');
    job.location = JSON.parse(match).location.replace(/&amp;/g, '&');
    job.description = JSON.parse(match).description.replace(/&amp;/g, '&');
    job.salary = JSON.parse(match).salary.replace(/&amp;/g, '&');
    job.datePosted = JSON.parse(match).datePosted.replace(/&amp;/g, '&');
    job.dateApplied = new Date();
    job.employmentType = JSON.parse(match).employmentType.replace(/&amp;/g, '&');
    job.status = JSON.parse(match).status.replace(/&amp;/g, '&');

    return job;
}

/**
 * Workday is a site that many companies use for posting job listings that has a very specific format.
 * This function parses the page and returns the job information.
 * @param html
 * @param link
 * @returns the job information
 */
function parseWorkdayJob( html: string, link: string ): Job {
    let job: Job = createEmptyJob(link);

    const json = html.match(/<script type="application\/ld\+json">(.|\n)*?<\/script>/g);
    if (json) {
        const data = JSON.parse(json[0].replace('<script type="application/ld+json">', '').replace('</script>', ''));
        job.title = data.title ? data.title : 'Not found';
        job.company = data.hiringOrganization.name ? data.hiringOrganization.name : 'Not found';
        job.location = data.jobLocation.address.addressLocality ? data.jobLocation.address.addressLocality : 'Not found';
        job.description = data.description ? data.description : 'Not found';
        job.datePosted = data.datePosted ? new Date(data.datePosted) : 'Not found';
        job.dateApplied = new Date();
        job.employmentType = data.employmentType ? data.employmentType : 'Not found';
        job.status = 'waiting';
    } else {
        job.title = 'Not found';
        job.company = 'Not found';
        job.location = 'Not found';
        job.description = 'Not found';
        job.employmentType = 'Not found';
    }

    return job;
}
