export function Table( props: {userData: JSON} ) {
    return <table>
        <thead>
        <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Description</th>
            <th>Link</th>
        </tr>
        </thead>
        <tbody>
            {/* @ts-ignore - jobs is always defined */}
            {props.userData.jobs.map((job: any) => {
                return <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.salary}</td>
                    <td>{job.description}</td>
                    <td><a href={job.link}>Link</a></td>
                </tr>
            })}
        </tbody>
    </table>;
}