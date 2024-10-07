import "./App.css";

import {BrowserRouter as Router, Routes, Route, HashRouter} from 'react-router-dom';
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Navigation from "./components/Naviagtion";
import Profile from "./pages/Profile";
import { About } from "./pages/About";

function App() {

    return (
        <>
            <HashRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route  path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/about" element={<About/>} />
                </Routes>
            </HashRouter>

        </>
    );
}

export default App;