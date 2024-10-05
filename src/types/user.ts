import { Job } from "./job.js";

export type User = {
    username: string;
    password: string;
    jobs: Job[];
}