import Header from "../components/Header";
import "../assets/style/Admin_Login.css"
import React from "react";
import Footer from "../components/Footer";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        let res;
    try {
        res = await axios.post("http://127.0.0.1:5000/login", {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        }, {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        toast.error("Erreur de création",error.message);
        console.error("❌ Erreur de fetch :", error);
    }
    if (res.data.auth) {
        navigate("/admin_panel");
    }

    }
    return (
        <>
            <Header />
            <div className="container-admin-login">
                <form action="submit" onSubmit={handleSubmit} id={"login-Form"} className="form-admin">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input name={"username"} id="username" className={"username"} type="text"/>

                    <label htmlFor="password">Mot de passe</label>
                    <input name={"password"} id="password" className={"password"} type="password"/>

                    <button className={"btn-send"}>
                        connexion
                    </button>
                </form>
            </div>
            <Footer />

        </>
    );
}

export default AdminLogin;