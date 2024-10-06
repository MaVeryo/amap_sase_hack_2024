import { ObjectId } from "mongodb";

export type Job = {
    _id: ObjectId;
    title: string;
    company: string;
    location: string;
    description: string;
    salary?: string;
    link: string;
    datePosted?: Date | string;
    dateApplied?: Date | string;
    employmentType?: string;
    status?: string;
};

export function createEmptyJob( link: string ): Job {
    return {
        _id: new ObjectId(),
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        link: link,
        datePosted: '',
        dateApplied: '',
        employmentType: '',
        status: ''
    };
}