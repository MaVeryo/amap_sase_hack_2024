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

async function toUserFunc(event: React.MouseEvent<HTMLButtonElement>, navigate: ReturnType<typeof useNavigate> ){
    event.preventDefault();
    const input = {
        user: document.getElementById('username') as HTMLInputElement | null,
        pass: document.getElementById('password') as HTMLInputElement | null
    };

    //response checker? 

    navigate('/userprofile');
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

    console.log(userData);  
    return (
        <div className="flex h-screen">
           
            {/* Sidebar: 35% of the screen when visible */}
            {isSidebarVisible && (
                <div className="w-1/4 bg-background p-4 flex flex-col justify-between relative items-center">
                    
                    <div className = "flex items-cenT   er space-x-4"> 
                        <h1 className="text-xl font-bold">Dashboard</h1>
                        {/* Toggle Sidebar Button */}
                        <button
                            className="absolute top-4 right-4 bg-background hover:bg-blue-400 text-white px-4 py-2 rounded"
                            onClick={toggleSidebar}
                        >
                            x
                        </button>
                        {/* Other sidebar content */}
                        <div className="mt-10">
                            <button
                                id="logoutButton"
                                className="bg-background hover:bg-blue-400 text-white px-4 py-2 rounded"
                                onClick={() => onLogout(navigate)}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        <div className="flex-col">
        {/* Button when the sidebar is hidden, positioned top-left of the screen */}
            {!isSidebarVisible && (
                <button
                    className="absolute top-4 left-4 bg-background hover:bg-blue-400 text-white px-4 py-2 rounded"
                    onClick={toggleSidebar}
                >
                    Logo
                </button>
            )}
        {userData && (
            <>
                {/* @ts-ignore - username is always defined */}
                <h1>{userData.username}'s Jobs</h1>

                <AddJobForm userData={userData} setUserData={setUserData}/>

                <div>
                    <h2>Jobs</h2>
                    <Table userData={userData} updateUserData={updateUserData}/>
                </div>
            </>
        )}
        
        </div>

        <button 
            id="toUser" 
            type="button" 
            className ="bg-background text-white p-3 rounded-md mt-3 absolute top-4 right-4 hover:bg-blue-400" 
            onClick={(e) => toUserFunc(e, navigate)}>PFP</button>
    </div>
        
            
     
    );
}

export default Dashboard;
