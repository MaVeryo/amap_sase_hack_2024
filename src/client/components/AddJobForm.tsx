import React, { useState } from "react";

export default function AddJobForm({ userData, setUserData }: { userData: any, setUserData:
    React.Dispatch<React.SetStateAction<any>> }) {
    const [ link, setLink ] = useState('');

    async function addJob() {
        const response = await fetch('/add-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({link}),
        });
        if (response.ok) {
            const newJob = await response.json();
            setUserData(( prevState: any ) => {
                return {...prevState, jobs: [ ...prevState.jobs, newJob ]};
            });
        } else {
            console.error('Failed to add job');
        }
    }

    return (
        <div className="flex-row m-7">
            <input type="text" placeholder="Link" value={link} onChange={( e ) => setLink(e.target.value)}
                className="p-2.5 rounded-md m-2"
            />
            <button onClick={addJob}>Add Job</button>
        </div>
    );

}