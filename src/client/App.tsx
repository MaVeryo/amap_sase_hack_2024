import "./App.css";

import {BrowserRouter as Router, Routes, Route, HashRouter} from 'react-router-dom';
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Navigation from "../client/components/Naviagtion";
import Profile from "./pages/Profile";

function App() {

    return (
        <>
            <HashRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route  path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </HashRouter>

        </>
    );
}

export default App;