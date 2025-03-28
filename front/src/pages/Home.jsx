import Header from "../components/Header";
import Footer from "../components/Footer";
import {decodeToken} from "react-jwt";
import {useState} from "react";

function Home() {



    return (
        <>
            <Header />
        <div>
            Bonjour
        </div>
            <Footer />
    </>
    );
}

export default Home;