    import React, {useRef, useState, useCallback, useEffect} from "react";
    import {useLocation, useParams} from "react-router-dom";
    import Header from "../components/Header";
    import {Bounce, toast, ToastContainer} from 'react-toastify';

    import "../assets/style/Add_User.css";
    import "../assets/style/Facial_Recognition.css"

    import Webcam from "react-webcam";
    import Footer from "../components/Footer";
    import {CreateUser, GetAllDataByParameter, UpdateUser} from "../assets/services/Users";

    const EditUser = () => {
        let [userData, setUserData] = useState(false);
        const webcamRef = useRef(null);
        const canvasRef = useRef(null);
        const [permissionDenied, setPermissionDenied] = useState(false);
        const [cameraAccepted, setCameraAccepted] = useState(false);
        const [showWebcam, setShowWebcam] = useState(false);
        const [countdown, setCountdown] = useState(0);
        let [capturedImage, setCapturedImage] = useState(null);
        const location = useParams();
        const [base64Image, setBase64Image] = useState("");

        const handleUserMediaError = useCallback(
            (error) => {
                console.error("Webcam access error:", error);
                setPermissionDenied(true);
            }, []);

        const handleUserMedia = useCallback(() => setCameraAccepted(true), []);

        const handleScanFaceClick = () => {
            setShowWebcam(true);
            startCountdown();
        };

        const handleSubmit = async (e) => {
            e.preventDefault();


            const first_name = document.getElementById("firstName").value;
            const last_name = document.getElementById("lastName").value;


            await UpdateUser(location.id, first_name, last_name, base64Image);
            toast.success('🦄 Wow so easy!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });

        };

        const startCountdown = () => {
            setCountdown(3);
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 1) {
                        clearInterval(countdownInterval);
                        captureImage();
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        };

        const captureImage = () => {
            if (webcamRef.current && canvasRef.current) {
                const canvas = canvasRef.current;
                const video = webcamRef.current.video;
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;

                canvas.width = videoWidth;
                canvas.height = videoHeight;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

                const base64Data = canvas.toDataURL("image/jpeg");
                setBase64Image(base64Data);

                setCapturedImage(base64Data);
            }
        };

        const displayModifyUser = async () => {
            const user = await GetAllDataByParameter(`user/${location.id}`);

            if (user.data.data.length > 0){
                document.getElementById("firstName").value = user.data.data[0].first_name;
                document.getElementById("lastName").value = user.data.data[0].last_name;
                setCapturedImage(user.data.data[0].facial_data);
                setBase64Image(user.data.data[0].facial_data);
            }
        }

        if (!userData) {
            setUserData(true);

            displayModifyUser();
        }

        return (
            <>
                <Header/>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Bounce}
                />
                <div className="container-add-user">
                    <form action={"modify"}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">Nom</label>
                                <input name="firstName" id="firstName" className="firstName" type="text" required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Prénom</label>
                                <input name="lastName" id="lastName" className="lastName" type="text" required/>
                            </div>
                        </div>
                        <label htmlFor="profilePicture" className="labelPicture">Ajout de la reconnaissance
                            faciale</label>
                        <button type="button" className="btnScan" onClick={handleScanFaceClick}>Scanner le visage
                        </button>
                        {showWebcam && (
                            <div className="webcam-container">
                                {permissionDenied ? (
                                    <p className="error-message">
                                        Permission refusée. Autorisez l'accès à la webcam.
                                    </p>
                                ) : (
                                    <>
                                        <Webcam
                                            ref={webcamRef}
                                            className="webcam"
                                            audio={false}
                                            screenshotFormat="image/jpeg"
                                            onUserMedia={handleUserMedia}
                                            onUserMediaError={handleUserMediaError}
                                            videoConstraints={{facingMode: "user"}}
                                        />
                                        {countdown > 0 && (
                                            <div className="countdown">
                                                {countdown}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {capturedImage && (
                            <div className="captured-image-container">
                                <h3>Photo capturée :</h3>
                                <img src={capturedImage} alt="Captured" className="captured-image"/>
                            </div>
                        )}
                        <canvas
                            ref={canvasRef}
                            id="canvas"
                        >

                        </canvas>
                        <div className="btnContainer">
                            <button type="button" className="btnBack" onClick={() => window.history.back()}>Retour
                            </button>
                            <button type="submit" className="btnAdd" onClick={handleSubmit}>{"Modifier"}</button>
                        </div>
                    </form>
                </div>
                <Footer/>
            </>
        );
    };

    export default EditUser;