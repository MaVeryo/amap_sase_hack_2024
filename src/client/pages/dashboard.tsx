import "../App.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
// import {useEffect, useState} from "react";

async function onLogout(navigate: Function) {
    console.log('Logging out');
    const response = await fetch('/logout', {
        method: 'GET',
    });
    if (response.ok) {
        navigate('/');
        // window.location.href='/'; // Redirect to the root URL
    } else {
        console.error('Logout failed');
    }
}

function Dashboard() {
    const navigate = useNavigate()
    return (
        <>
            <h1>Dashboard</h1>
            <div>
                <button id="logoutButton" className="button is-info" onClick={() => onLogout(navigate)}>Logout</button>
            </div>
        </>
    );
}

export default Dashboard;