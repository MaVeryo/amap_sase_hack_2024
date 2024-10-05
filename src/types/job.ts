import { ObjectId } from "mongodb";

export type Job = {
    _id: ObjectId;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    link: string;
}