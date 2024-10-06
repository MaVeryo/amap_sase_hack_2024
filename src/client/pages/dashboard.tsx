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
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    useEffect(() => {
        getUserData().then(( data ) => setUserData(data));
    }, []);

    const updateUserData = (jobs: any[]) => {
        setUserData((prevState: any) => {
            return {...prevState, jobs: jobs};
        });
    }
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };


    return (
        <div className="flex h-screen"> 
            {/* Button to Toggle Sidebar*/}
            <button
                className={`absolute top-4 ${isSidebarVisible ? 'right-4' : 'left-4'} bg-background hover:bg-blue-400 text-white px-4 py-2 rounded`}
                onClick={toggleSidebar}
            >
                {isSidebarVisible ? 'x' : 'Logo'}
            </button>
            {isSidebarVisible && (
                        <div className="w-4/10 bg-background p-4 justify-end">
                        <h1 className="text-xl font-bold">Dashboard</h1>
                        {/* <p>This column takes up 20% of the screen width.</p> */}
                    
                        <div className="mt-auto">
                                <button
                                    id="logoutButton"
                                    className="button is-info px-4 py-2 hover:bg-blue-400"
                                    onClick={() => onLogout(navigate)}
                                >
                                    Logout
                                </button>
                        </div>
                    </div>
                    )}
                
                <div className ={`flex-grow bg-background p-4 flex flex-col  ${isSidebarVisible ? 'w-4/5' : 'w-full'}`}>
                    {/* Top Section: Dashboard Title */}
                 <div>
                     {userData && (
                       <>
                             {/* @ts-ignore - username is always defined */}
                             <h1 className="text-2xl font-bold">{userData.username}'s Jobs</h1>
                             <p className="text-gray-600">Here are your jobs:</p> {/*comment this out later */}
                         </>
                     )}
                    </div>
                    <div>
                                 <h2>Jobs</h2>
                                 {/* @ts-ignore - username is always defined */}
                                <Table userData={userData} updateUserData={updateUserData}/>
                         </div> 
                </div>
            </div>
        
    );
}

export default Dashboard;