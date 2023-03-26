import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import About from "./components/layouts/About";
import Register from "./components/accounts/Register";
import Login from "./components/accounts/Login";
import Home from "./components/layouts/Home"
import Journal from "./components/layouts/Journal"
import Profile from "./components/accounts/Profile";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Header from "./components/layouts/Header";
import ErrorMessage from "./components/layouts/ErrorMessage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <ErrorMessage />
                <Routes>
                    <Route exact path="/" element={<About />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route
                        exact path="/profile"
                        element={
                            <WithPrivateRoute>
                                <Profile />
                            </WithPrivateRoute>
                        }
                    />
                    <Route
                        exact path="/home"
                        element={
                            <WithPrivateRoute>
                                <Home />
                            </WithPrivateRoute>
                        }
                    />
                    <Route
                        exact path="/journal"
                        element={
                            <WithPrivateRoute>
                                <Journal />
                            </WithPrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;