import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Tutorials from "./pages/Tutorials";
import TutorialDetail from "./pages/TutorialDetail";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

function Layout({ children }) {
    return (
        <div className="App min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Layout>
                                <Home />
                            </Layout>
                        }
                    />
                    <Route
                        path="/tutoriels"
                        element={
                            <Layout>
                                <Tutorials />
                            </Layout>
                        }
                    />
                    <Route
                        path="/tutoriels/:slug"
                        element={
                            <Layout>
                                <TutorialDetail />
                            </Layout>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <Layout>
                                <Categories />
                            </Layout>
                        }
                    />
                    <Route
                        path="/a-propos"
                        element={
                            <Layout>
                                <About />
                            </Layout>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <Layout>
                                <Login />
                            </Layout>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <Layout>
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            </Layout>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
