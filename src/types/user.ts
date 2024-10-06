import { Job } from "./job.js";
import { Experience } from "./expereince.js";

export type User = {
    username: string;
    password: string;
    email: string;
    phone: string;
    resume: string;
    experience: Experience[];
    linkedin: string;
    portfolio: string;
    jobs: Job[];
}