import { useState } from "react";


export default function AddJobForm(userData: any, setUserData: any) {
    const [link, setLink] = useState('');

    async function addJob() {
        const response = await fetch('/add-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link }),
        });
        if (response.ok) {
            const data = await response.json();
            setUserData(data);
        } else {
            console.error('Failed to add job');
        }
    }

    return (
        <div>
            <h2>Add Job</h2>
            <input type="text" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)}/>
            <button onClick={addJob}>Add Job</button>
        </div>
    );

}