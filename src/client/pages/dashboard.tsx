import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table } from "../components/table";
import AddJobForm from "../components/AddJobForm";

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
    const [ userData, setUserData ] = useState(null);

    useEffect(() => {
        getUserData().then(( data ) => setUserData(data));
    }, []);

    const updateUserData = (jobs: any[]) => {
        setUserData((prevState: any) => {
            return {...prevState, jobs: jobs};
        });
    }

    return (
        <div className="flex-col">
            {userData && (
                <>
                    {/* @ts-ignore - username is always defined */}
                    <h1>{userData.username}'s Dashboard</h1>

                    <AddJobForm userData={userData} setUserData={setUserData}/>

                    <div>
                        <h2>Jobs</h2>
                        <Table userData={userData} updateUserData={updateUserData}/>
                    </div>
                </>
            )}
            <button id="logoutButton" className="button is-info mt-10" onClick={() => onLogout(navigate)}>Logout</button>
        </div>
    );
}

export default Dashboard;