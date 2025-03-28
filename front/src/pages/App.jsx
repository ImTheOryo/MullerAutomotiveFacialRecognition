import Header from "../components/Header";
import "../assets/style/App.css"
import React from "react";
import {Link} from "react-router-dom";
import Footer from "../components/Footer";

function App() {

  return (
      <>
          <Header />
          <div className="app">
              <Link to={"/facial_recognition"}>
                  <button className="button">
                      RECONNAISSANCE FACIALE
                  </button>
              </Link>
          </div>
          <Footer />
      </>
  );
}

export default App;
