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
    </div>
        
            
        // <div className="flex h-screen">
        //     {/* Button to Toggle Sidebar*/}
        //     <button
        //         className={`absolute top-4 ${isSidebarVisible ? 'right-4' : 'left-4'} bg-background hover:bg-blue-400 text-white px-4 py-2 rounded`}
        //         onClick={toggleSidebar}
        //     >
        //         {isSidebarVisible ? 'x' : 'Logo'}
        //     </button>
        //     {isSidebarVisible && (
        //                 <div className="w-4/10 bg-background p-4 justify-end">
        //                 <h1 className="text-xl font-bold">Dashboard</h1>
        //                 {/* <p>This column takes up 20% of the screen width.</p> */}

        //                 <div className="mt-auto">
        //                         <button
        //                             id="logoutButton"
        //                             className="button is-info px-4 py-2 hover:bg-blue-400"
        //                             onClick={() => onLogout(navigate)}
        //                         >
        //                             Logout
        //                         </button>
        //                 </div>
        //             </div>
        //     )}

        //     {/*TODO:  Weird case where when i try to add the table there's a chance that none of the data show up*/}
        //     <div className ={"flex-grow bg-background p-4 flex flex-col  ${isSidebarVisible ? 'w-4/5' : 'w-full'}"}>  
        //           {/* Top Section: Dashboard Title */}
        //           <div>
        //             {/* this doesn't show up when relaoding webpage? not storing userData? */}
        //             {userData && (
        //               <>
        //                     {/* @ts-ignore - username is always defined */}
        //                     <h1 className="text-2xl font-bold">{userData.username}'s Jobs</h1>
        //                     <p className="text-gray-600">Here are your jobs:</p> {/*comment this out later */}
        //                 </>
        //             )}
        //            </div>
        //            <div>
        //                         <h2>Jobs</h2>
        //                         {/* @ts-ignore - username is always defined */}
        //                        <Table userData={userData} updateUserData={updateUserData}/>
        //                 </div> 
        //     </div>
        // </div>
    );
}

export default Dashboard;
