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
                    <Table userData={userData} updateUserData={updateUserData}/>
                </>
            )}
            {/*<button id="logoutButton" className="button is-info mt-10" onClick={() => onLogout(navigate)}>Logout</button>*/}
        </div>
    );
}

export default Dashboard;
// <div className="flex h-screen ">
//     {/* Button to Toggle Sidebar */}
//     <button
//         className={`absolute top-4 ${isSidebarVisible ? 'right-4' : 'left-4'} bg-background hover:bg-blue-400 text-white px-4 py-2 rounded`}
//         onClick={toggleSidebar}
//     >
//         {isSidebarVisible ? 'x' : 'Logo'}
//     </button>

//     {/* Left Column: 30% */}
//     {isSidebarVisible && (
//         <div className="w-4/10 bg-dashboard p-4 justify-end">
//         <h1 className="text-xl font-bold">Dashboard</h1>
//         {/* <p>This column takes up 20% of the screen width.</p> */}

//         <div className="mt-auto">
//                 <button
//                     id="logoutButton"
//                     className="button is-info px-4 py-2 hover:bg-blue-400"
//                     onClick={() => onLogout(navigate)}
//                 >
//                     Logout
//                 </button>
//         </div>
//     </div>
//     )}

//     {/* Right Column: 80% */}
//     <div className={`flex-grow bg-background p-4 flex flex-col  ${isSidebarVisible ? 'w-4/5' : 'w-full'}`}>
//         {/* Top Section: Dashboard Title */}
//         <div>
//             {userData && (
//                 <>
//                     {/* @ts-ignore - username is always defined */}
//                     <h1 className="text-2xl font-bold">{userData.username}'s Jobs</h1>
//                     <p className="text-gray-600">Here are your jobs:</p>
//                 </>
//             )}
//         </div>

//         {/* Jobs Table or Content */}
//         <div>
//             <table className="min-w-full border border-table">
//                 <thead>
//                     <tr className="bg-border-table">
//                         <th className="border border-table px-4 py-2">Title</th>
//                         <th className="border border-table px-4 py-2">Company</th>
//                         <th className="border border-table px-4 py-2">Location</th>
//                         <th className="border border-table px-4 py-2">Salary</th>
//                         <th className="border border-table px-4 py-2">Description</th>
//                         <th className="borderborder-table px-4 py-2">Link</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <p className="justify-content: center"> Will Have Jobs </p>
//                 </tbody>
//             </table>
//         </div>

//         {/* Bottom Section: Logout Button */}
//         <div className="flex justify-end">

//         </div>
//     </div>
// </div>
// <div className="flex h-screen">
//     {/* Left Column: User's Dashboard and Logout Button */}
//     <div className="w-1/5 p-4 bg-background border-r border">
//         <div className="flex flex-col space-y-4">

//             <p className="text-xl font-bold"> Dashboard</p>
//             <button id="logoutButton" className="button is-info" onClick={() => onLogout(navigate)}>Logout</button>

//         </div>
//     </div>

//     {/* Right Column: Jobs Table */}
//     <div className="w-4/5 p-4 overflow-auto">
//         {userData && (
//             <>
//              {/* @ts-ignore - username is always defined */}
//              <h2 className="text-lg font-semibold mb-2"> {userData.username}'s Jobs</h2>
//             </>

//         )}

//         <table className="min-w-full border border-gray-300">
//             <thead>
//                 <tr className="bg-gray-100">
//                     <th className="border border-gray-300 px-4 py-2">Title</th>
//                     <th className="border border-gray-300 px-4 py-2">Company</th>
//                     <th className="border border-gray-300 px-4 py-2">Location</th>
//                     <th className="border border-gray-300 px-4 py-2">Salary</th>
//                     <th className="border border-gray-300 px-4 py-2">Description</th>
//                     <th className="border border-gray-300 px-4 py-2">Link</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {/* Empty Row for Table */}
//                 <tr>
//                     <td colSpan={6} className="text-center text-gray-500 py-4">LOOK FOR JOBS!!!</td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>
// </div>