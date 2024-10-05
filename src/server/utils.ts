import { Job } from "../types/job.js";
import puppeteer from "puppeteer";
import { ObjectId } from "mongodb";


/**
 * Takes a link to a job posting, scrapes the page, and returns the job information.
 * @param link the link to the job posting
 * @returns the job information
 */
export async function getJobInfoFromLink( link: string ): Promise<Job | null> {
    let job: Job = {
        _id: new ObjectId(),
        title: '',
        company: '',
        location: '',
        description: '',
        link: link
    };

    // Scrape the page
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(link);      // TODO: input sanitization/validation to make sure the link is valid

    // Get the job information
    const pageInfo = await page.evaluate(() => {
        return {page: document.querySelector('html')?.innerHTML};
    });
    if (!pageInfo || !pageInfo.page) {
        return null;
    }
    await browser.close();
    const html = pageInfo.page;

    if (link.includes('workday')) {
        job = parseWorkdayJob(html, link);
    }

    // Parse the page

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
    let job: Job = {
        _id: new ObjectId(),
        title: '',
        company: '',
        location: '',
        description: '',
        link: link,
        datePosted: '',
        dateApplied: '',
        employmentType: '',
        status: ''
    };

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
