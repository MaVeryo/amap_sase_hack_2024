import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table } from "../components/table";
import AddJobForm from "./AddJobForm";

async function onLogout(navigate: Function) {
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
                    <p>{userData.username}'s Dashboard</p>

                    <AddJobForm userData={userData} setUserData={setUserData}/>

                    <div>
                        <h2>Jobs</h2>
                        <Table userData={userData}/>
                    </div>
                </>
            )}
            <button id="logoutButton" className="button is-info" onClick={() => onLogout(navigate)}>Logout</button>
        </div>
    );
}

export default Dashboard;