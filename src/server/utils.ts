import { createEmptyJob, Job } from "../types/job.js";
import puppeteer from "puppeteer";
import fs from 'fs';
import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

/**
 * Takes a link to a job posting, scrapes the page, and returns the job information.
 * @param link the link to the job posting
 * @returns the job information
 */
export async function getJobInfoFromLink( link: string ): Promise<Job | null> {
    // input sanitization/validation to make sure the link is valid
    if (!link) {
        return null;
    }
    // regex to check if the link is a valid URL
    const urlRegex = new RegExp('^(http|https)://', 'i');
    if (!urlRegex.test(link)) {
        return null;
    }

    let job: Job | null = createEmptyJob(link);
    let html;

    // Scrape the page
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link, {
            waitUntil: 'domcontentloaded',
        });
        await page.waitForNetworkIdle().then(async () => html = await page.content());  // Wait for the page to load
        await browser.close();
    } catch (e) {
        console.error(e);
        return null;
    }

    if (!html) {
        return null;
    }
    if (process.env.DEBUG) {
        fs.writeFileSync('debug.html', html);
    }

    // Check if the page is a Workday page since it has a predictable format
    // It's a lot faster to check this first than to run the AI model on every page
    // if (link.includes('workday')) {
    //     job = parseWorkdayJob(html, link);
    // } else {
    //     job = await parseJob(html, link);
    // }
    job = await parseJob(html, link);
    if (!job) {
        return null;
    }

    job.title = job.title?.replace(/&amp;/g, '&');
    job.company = job.company?.replace(/&amp;/g, '&');
    job.location = job.location?.replace(/&amp;/g, '&');
    job.description = job.description?.replace(/&amp;/g, '&');
    job.salary = job.salary?.replace(/&amp;/g, '&');
    job.employmentType = job.employmentType?.replace(/&amp;/g, '&');
    job.status = 'waiting';

    return job;
}

/**
 * Cleans the html of the page by removing unnecessary elements.
 * @param html the html of the page
 * @returns the cleaned html
 */
function cleanHtml( html: string ): string {
    // remove scripts and styles (these take up the most space and are usually not needed, except for Workday pages which use scripts for SEO)
    html = html.replace(/<script.*?>.*?<\/script>/gs, '');
    html = html.replace(/<style.*?>.*?<\/style>/gs, '');

    // remove all tags except the allowed tags
    const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'span', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'em', 'b', 'i', 'u', 'strike', 'sup', 'sub', 'code', 'pre', 'blockquote', 'img'];
    html = html.replace(new RegExp('<(?!(' + allowedTags.join('|') + '))[^>]+>', 'gs'), '');

    // remove all attributes except href, src, and content
    html = html.replace(/<[^>]+>/gs, (match) => {
        return match.replace(/ (?!href|src|content)[^=]+=['"][^'"]*['"]/g, '');
    });

    // other cleaning
    html = html.trim();
    html = html.replace(/<!--.*?-->/gs, '');                        // remove comments
    html = html.replace(/<!DOCTYPE.*?>/gs, '');                     // remove doctype
    html = html.replace(/<link.*?>/gs, '');                         // remove links
    html = html.replace(/<[^>]+><\/[^>]+>/gs, '');                  // remove empty tags
    html = html.replace(/\s+/gs, ' ');                              // remove extra whitespace
    html = html.replace(/\n+/gs, '\n');                             // remove extra newlines
    html = html.replace(/ style=['"][^'"]*['"]/g, '');              // remove style attributes
    html = html.replace(/ (class|id)=['"][^'"]*['"]/g, '');         // remove class and id attributes
    html = html.replace(/ data-[^=]+=['"][^'"]*['"]/g, '');         // remove data attributes
    html = html.replace(/ aria-[^=]+=['"][^'"]*['"]/g, '');         // remove aria attributes
    html = html.replace(/ role=['"][^'"]*['"]/g, '');               // remove role attributes
    html = html.replace(/ tabindex=['"][^'"]*['"]/g, '');           // remove tabindex attributes
    html = html.replace(/ alt=['"][^'"]*['"]/g, '');                // remove alt attributes

    if (process.env.DEBUG) {
        fs.writeFileSync('cleaned.html', html);
    }

    return html;
}

/**
 * Parses the job information from the page.
 * @param html the html of the page
 * @param link the link to the page
 * @returns the job information
 */
async function parseJob( html: string, link: string ): Promise<Job | null> {
    const job: Job = createEmptyJob(link);
    html = cleanHtml(html);

    let response;
    try {
        response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: "Your task is to parse the job information from the following page. " +
                        "You should return the information in the following JSON format: " +
                        "{title: 'Job Title', company: 'Company Name', location: 'Location', description: 'Job Description', salary: 'Salary', datePosted: 'Date Posted', employmentType: 'Employment Type'}." +
                        "If you are unable to find any of the information, you can set it to 'Not found'." +
                        "Only respond with the JSON object. Do not include any extra text or information." +
                        "PAGE: " + html,
                },
            ],
            model: "llama3-8b-8192",
        });
    } catch (e) {
        console.error(e);
        return null;
    }

    if (!response || !response.choices || !response.choices[0]?.message?.content) {
        return null;
    }

    // I don't trust the AI to not add any extra information, so this just gets the text between the curly braces
    const regex = /{([^}]*)}/;
    let match = response.choices[0]?.message?.content.match(regex) || "{}";
    match = match[0].replace(/'/g, ' ');
    console.log(match);

    // set the job information and replace any HTML entities (usually just &amp;, but if there are more, they can be added here)
    job.title = JSON.parse(match).title;
    job.company = JSON.parse(match).company;
    job.location = JSON.parse(match).location;
    job.description = JSON.parse(match).description;
    job.salary = JSON.parse(match).salary;
    job.datePosted = JSON.parse(match).datePosted;
    job.dateApplied = new Date();
    job.employmentType = JSON.parse(match).employmentType;
    job.status = JSON.parse(match).status;

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
