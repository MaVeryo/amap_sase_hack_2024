export function Table( props: {userData: JSON, updateUserData: ( jobs: any[] ) => void} ) {

    async function deleteJob( id: string ) {
        const response = await fetch('/delete-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        });

        if (response.ok) {
            // @ts-ignore - jobs is always defined because of the structure of the JSON object
            const updatedJobs = props.userData.jobs.filter(( job: any ) => job._id !== id);
            props.updateUserData(updatedJobs);
        } else {
            console.error('Failed to delete job');
        }
    }

    return <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Description</th>
                <th>Link</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {/* @ts-ignore - jobs is always defined */}
            {props.userData.jobs.map(( job: any ) => {
                return <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.salary}</td>
                    <td>{job.description}</td>
                    <td><a href={job.link} target="_blank">Link</a></td>
                    <td>
                        <button className="button is-danger" onClick={() => deleteJob(job._id)}>Delete</button>
                    </td>
                </tr>
            })}
        </tbody>
    </table>;
}