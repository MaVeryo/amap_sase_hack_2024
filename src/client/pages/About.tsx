import { IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react';

export function About() {

    const team = [
        { name: 'Alden Cutler', role: 'Fullstack Developer', linkedin: 'https://www.linkedin.com/in/aldencutler/', github: 'https://github.com/AldenCutler', imgPath: '/src/client/assets/alden.png' },
        { name: 'Mahit Verma', role: 'Fullstack Developer', linkedin: 'https://www.linkedin.com/in/mahit-verma/', github: 'https://github.com/MaVeryo', imgPath: '/src/client/assets/mahit.png' },
        { name: 'Pakorn Liengsawangwong', role: 'Fullstack Developer', linkedin: '#', github: 'https://github.com/pako490', imgPath: '/src/client/assets/pakorn.png' },
    ]

    // @ts-ignore
    return (
        <div className="p-4 text-left ml-10 align-top">
            <h1 className="ml-5 mb-5">About</h1>
            <div className="flex">
                <div className="w-1/2 p-5">
                    <h1 className="text-2xl font-bold">Who are we?</h1>
                    {/* app info */}
                    <div>
                        <p className="mt-4">
                            We are a team of three students at Worcester Polytechnic Institute, building a web
                            application
                            for SASEHack 2024.
                        </p>
                        <p className="mt-4">
                            Our project is a web application that helps people keep track of their job applications.
                            Users
                            input a link to a job posting, and the application will scrape the job posting for relevant
                            information such as the job title,
                            company, location, and job description. Users can then view all of their job applications in
                            a
                            table format, and they can
                            filter the table by company, location, and job title.
                        </p>
                        <p className="mt-4">
                            We built this application using a MERN stack (MongoDB, Express, React, Node.js). We
                            also used Puppeteer to scrape job postings, and we used Tailwind CSS for styling.
                        </p>
                    </div>

                    {/* SASEhack info */}
                    <div>
                        <h2 className="text-2xl font-bold mt-16">SASEHack 2024</h2>
                        <p className="mt-4">
                            SASEHack is a 3-day hackathon hosted by the Society of Asian Scientists and Engineers
                            (SASE).
                            The hackathon is open to all undergraduate students, and participants can work in teams of
                            up to four people.
                        </p>
                        <p className="mt-4">
                            The theme of SASEHack 2024 is "Stages of Life." Participants are encouraged to build
                            projects that
                            help people at different stages of life. This year, there are four tracks for participants
                            to choose from:
                            Childhood, Adolescence, Adulthood, and Elderly. Participants can build projects that help
                            people at
                            different stages of life in areas such as education, healthcare, and social services, but
                            must choose one
                            prompt to submit their project under.
                        </p>
                    </div>
                </div>

                {/* @ts-ignore spacer */}
                <div className="w-0.5 m-10" style={{"background-color": "#262626"}}></div>

                {/* about team members */}
                <div className="w-1/3">
                    <h2 className="text-2xl font-bold ml-5">Meet the Team</h2>
                    <ul>
                        {team.map(( member, idx ) => (
                            <li key={idx} className="flex items-center m-5">
                                <div className="max-h-40 max-w-32">
                                    <img src={member.imgPath} alt={member.name} className="rounded-lg overflow-hidden"/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold">{member.name}</h3>
                                    <p>{member.role}</p>
                                    <div className="flex mt-2 space-x-5">
                                        <a href={member.linkedin} className="text-white decoration-0"
                                           target="_blank"><IconBrandLinkedin size={50}/></a>
                                        <a href={member.github} className="text-white" target="_blank"><IconBrandGithub
                                            size={50}/></a>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
}