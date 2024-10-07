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

    return <table className="ml-16 max-w-screen-sm md:max-w-screen-lg lg:max-w-fit">
        <thead>
        <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Salary</th>
            {/*<th>Description</th>*/}
            <th>Date Posted</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th>Link</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {/* @ts-ignore - jobs is always defined */}
        {props.userData.jobs.map(( job: any ) => {
            return <tr key={job._id}>
                <td className="text-left">{job.title}</td>
                <td className="text-left">{job.company}</td>
                <td className="text-left">{job.location}</td>
                <td>{job.salary}</td>
                {/*<td className="text-left">{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</td>*/}
                <td>{job.datePosted.substring(0, 10)}</td>
                <td>{job.dateApplied.substring(0, 10)}</td>
                <td>
                    <select
                        className="p-3 rounded-md"
                        value={job.status}
                        onChange={async ( e ) => {
                            // @ts-ignore - jobs is always defined because of the structure of the JSON object
                            const updatedJobs = props.userData.jobs.map(( j: any ) =>
                                j._id === job._id ? {...j, status: e.target.value} : j
                            );
                            props.updateUserData(updatedJobs);
                            await fetch('/update-job-status', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({id: job._id, status: e.target.value}),
                            });
                        }}
                    >
                        <option value="waiting">Waiting For Interview</option>
                        <option value="rejected">Rejected</option>
                        <option value="interview">Interviewing</option>
                        <option value="post-interview">Waiting For Offer</option>
                        <option value="offer">Received Offer</option>
                    </select>
                </td>
                <td><a href={job.link} target="_blank">Link</a></td>
                <td>
                    <button className="button is-danger" onClick={() => deleteJob(job._id)}>Delete</button>
                </td>
            </tr>
        })}
        </tbody>
    </table>;
}