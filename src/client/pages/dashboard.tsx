import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


async function onLogout( navigate: Function ) {
    console.log('Logging out');
    const response = await fetch('/logout', {
        method: 'GET',
    });
    if (response.ok) {
        navigate('/');
    } else {
        console.error('Logout failed');
    }
}

async function getUserData() {
    const response = await fetch('/user-data', {
        method: 'GET',
    });
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Failed to get user data');
    }
}
function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getUserData().then((data) => setUserData(data));
    }, []);

    return (
        <div className="flex-col">

            {userData && (
                <>
                    {/* @ts-ignore - username is always defined */}
                    <h1>{userData.username}'s Dashboard</h1>
                    {/* <h2>Jobs</h2> */}
                    <table>
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
                        {userData.jobs.map(( job: any ) => (
                            <tr key={job._id}>
                                <td>{job.title}</td>
                                <td>{job.company}</td>
                                <td>{job.location}</td>
                                <td>{job.salary}</td>
                                <td>{job.description}</td>
                                <td>{job.link}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
            {/* <button id="logoutButton" className="button is-info" onClick={() => onLogout(navigate)}>Logout</button> */}
        </div>
    );
}

export default Dashboard;