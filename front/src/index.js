    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './pages/App';
    import File_404 from "./pages/404";
    import reportWebVitals from './reportWebVitals';
    import { createBrowserRouter, RouterProvider, } from "react-router-dom";
    import AdminLogin from "./pages/Admin_Login";
    import Facial_Recognition from "./pages/Facial_Recognition";
    import AdminPanel from "./pages/Admin_Panel";
    import AddUser from "./pages/Add_User";
    import RGPD from "./pages/RGPD";
    import EditUser from "./pages/Edit_User";
    import Home from "./pages/Home";

    const router = createBrowserRouter([
        { path: '/', element: <App /> },
        { path: '/alternate_login', element: <AdminLogin />},
        // eslint-disable-next-line react/jsx-pascal-case
        { path: '/facial_recognition', element: <Facial_Recognition /> },
        { path: '/admin_panel', element: <AdminPanel /> },
        { path: '/admin_panel/add_user', element: <AddUser /> },
        { path: '/admin_panel/edit_user/:id', element: <EditUser /> },
        { path: '/rgpd', element: <RGPD /> },
        { path: '/home', element: <Home /> },
        // eslint-disable-next-line react/jsx-pascal-case
        {path: '*', element: <File_404 /> }

    ]);

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
          <RouterProvider router={router} />
      </React.StrictMode>
    );

    reportWebVitals();
