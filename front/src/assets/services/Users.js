import axios from "axios";
import {toast} from "react-toastify";
import {decodeToken} from "react-jwt";

    export const CreateUser = async (first_name, last_name, image) => {

        try {
            await axios.post("http://127.0.0.1:5000/users", {
                first_name: first_name ,
                last_name: last_name,
                facial_data: image,
            }, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            toast.error("Erreur de création",error.message);
            console.error("❌ Erreur de fetch :", error);
        }
    }

    export const DeleteUser = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/user/${id}`);
        } catch (error) {
            toast.error("Erreur de suppresion",error.message);
            console.error("❌ Erreur de fetch :", error);
        }
    }

    export const GetAllDataByParameter = async (parameter) => {
        let response;
        try {
            response = await axios.get(`http://127.0.0.1:5000/${parameter}`);
        } catch (error) {
            toast.error("Erreur de ",error.message);
            console.error("❌ Erreur de fetch :", error);
        }

        return response;
    }

    export const UpdateUser = async (id, first_name, last_name, facial_data) => {
        let response;
        try {
            response = await axios.patch(`http://127.0.0.1:5000/user/${id}`, {
                first_name: first_name,
                last_name: last_name,
                facial_data: facial_data,
            })
        } catch (error) {
            toast.error("Erreur de modification",error.message);
            console.error("❌ Erreur de fetch :", error);
        }
        return response;
    }

    export const CreateToken = async (user) => {
        let nb = Math.floor(user);
        let response;
        try {
            response = await axios.post("http://127.0.0.1:5000/verify", {
                "id": nb
            }, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            toast.error("Erreur de création",error.message);
            console.error("❌ Erreur de fetch :", error);
        }
    }