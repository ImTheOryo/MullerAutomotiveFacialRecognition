    import React, {useEffect, useState} from "react";
    import { FaEdit, FaTrashAlt } from "react-icons/fa";
    import { IoIosPersonAdd } from "react-icons/io";
    import { useNavigate } from "react-router-dom";
    import "../assets/style/Admin_Panel.css";
    import Header from "../components/Header";
    import ConfirmationModal from "../components/Modal_Delete";
    import Footer from "../components/Footer";
    import {DeleteUser, GetAllDataByParameter} from "../assets/services/Users";

    const AdminPanel = () => {

        const [modalIsOpen, setModalIsOpen] = useState(false);
        const [userToDelete, setUserToDelete] = useState(null);
        const [users, setUsers] = useState([]);

        const navigate = useNavigate();

        const displayUsers = async () => {
            const users = await GetAllDataByParameter("users");

            setUsers(users.data.data);
        }

        const handleEdit = (id) => {
            navigate(`/admin_panel/edit_user/${id}`);
        };

        const handleDelete = (id) => {
            setUserToDelete(id);
            setModalIsOpen(true);
        };

        const confirmDelete = async  () => {
            await DeleteUser(userToDelete)
            setModalIsOpen(false);
        };

        const handleAddUser = () => {
            navigate('/admin_panel/add_user');
        };

        useEffect( () => {
            displayUsers();
        })
        return (
            <>
                <Header />
                <div className={`container-admin-panel ${modalIsOpen ? 'blurred' : ''}`}>
                    <button className="add-btn" onClick={handleAddUser}>
                        <IoIosPersonAdd size={30} />
                    </button>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.last_name}</td>
                                <td>{user.first_name}</td>
                                <td>
                                    <FaEdit
                                        className="icon edit-icon"
                                        onClick={() => handleEdit(user.id)}
                                        title="Modifier"
                                        size={23}
                                    />
                                    <FaTrashAlt
                                        className="icon delete-icon"
                                        onClick={() => handleDelete(user.id)}
                                        title="Supprimer"
                                        size={23}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <ConfirmationModal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    onConfirm={confirmDelete}
                />
                <Footer />

            </>
        );
    };

    export default AdminPanel;