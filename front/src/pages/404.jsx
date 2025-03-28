import {Link} from "react-router-dom";
import "../assets/style/Font.css"
import "../assets/style/404.css"
import Header from "../components/Header.jsx";
import React from "react";
import Footer from "../components/Footer";


function File_404 () {
    return (
       <>
           <Header />
           <div className="center_container">
               <span style={{fontFamily:"Ethnocentric, sans-serif"}} className="textNotFound">
                   404 Page Not Found
               </span>
           </div>
           <div className="center_container">
               <Link to="/" className="btn-Home">Home</Link>
           </div>
           <Footer />
       </>
    );
}

export default File_404;