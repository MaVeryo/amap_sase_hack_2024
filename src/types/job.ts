import { ObjectId } from "mongodb";

export type Job = {
    _id: ObjectId;
    title: string;
    company: string;
    location: string;
    description: string;
    link: string;
    datePosted?: Date | string;
    dateApplied?: Date | string;
    employmentType?: string;
    status?: string;
};