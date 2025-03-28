import React, { useState, useEffect, useRef, useCallback } from "react";
import "../assets/style/Facial_Recognition.css";
import Header from "../components/Header";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Loading from "../components/Loading";
import {CreateToken, GetAllDataByParameter} from "../assets/services/Users";
import Footer from "../components/Footer";
import {Link, Navigate, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../provider/AuthProvider";

function Facial_Recognition() {
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [cameraAccepted, setCameraAccepted] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isFaceReconize, setFaceReconize] = useState(false);
    let [personUnknownCounter, setCounter] = useState(10);
    const [referenceFaceDescriptors, setReferenceFaceDescriptors] = useState([]);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const overlay = document.getElementById("overlay");
    const loading = document.getElementById("loading");
    const retry = document.getElementById("retry");


    const handleReload = () => {
        setCounter(10);
        setFaceReconize(false);
        loading.style.display = "flex";
        overlay.style.border = "0px";
        retry.style.display = "none";
    }

    const loadModels = async () => {
        const MODEL_URL = "/models";
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
        console.log("Modèles face-api.js chargés");
    };

    const handleUserMediaError = useCallback((error) => {
        console.error("Erreur d'accès à la webcam :", error);
        setPermissionDenied(true);
    }, []);

    const handleUserMedia = useCallback(() => setCameraAccepted(true), []);

    const detectFaces = async () => {
        if (
            isModelLoaded &&
            webcamRef.current &&
            webcamRef.current.video.readyState === 4 &&
            !isFaceReconize
        ) {
            const video = webcamRef.current.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (detections.length > 0 && referenceFaceDescriptors.length > 0) {
                const faceMatcher = new faceapi.FaceMatcher(
                    referenceFaceDescriptors,
                    0.4,
                );

                const results = detections.map((detection) =>
                    faceMatcher.findBestMatch(detection.descriptor)
                );
                if (results[0]._label) {
                    if (results[0]._label !== "unknown"){
                        setFaceReconize(true);
                        loading.style.display = "none";
                        overlay.style.border = "5px solid #00FF00";
                        setTimeout(() => {
                            navigate("/home");
                        },750)
                    } else {
                        personUnknownCounter = personUnknownCounter - 1;

                    }

                    if (personUnknownCounter === 0) {
                        setFaceReconize(true);
                        loading.style.display = "none";
                        retry.style.display = "flex"
                        overlay.style.border = "5px solid #ff0000";

                    }
                }
            }
        }
    };

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const users = await GetAllDataByParameter("verify");

                const faceDescriptors = await Promise.all(
                    users.data.data.map((user) => {
                        return new Promise(async (resolve) => {
                            try {
                                const img = new Image();

                                img.src = user.facial_data;

                                img.onload = async () => {
                                    try {
                                        const detection = await faceapi
                                            .detectSingleFace(
                                                img,
                                                new faceapi.TinyFaceDetectorOptions()
                                            )
                                            .withFaceLandmarks()
                                            .withFaceDescriptor();
                                        if (detection) {
                                            resolve(detection.descriptor);
                                        } else {
                                            console.error("No face detected for user", user);
                                            resolve(null);
                                        }
                                    } catch (error) {
                                        console.error("Error during face detection", error, user);
                                        resolve(null);
                                    }
                                };
                                img.onerror = (error) => {
                                    console.error("Error loading image for user", user, error);
                                    resolve(null);
                                };
                            } catch (e) {
                                console.error("Unexpected error while processing user", user, e);
                                resolve(null);
                            }
                        });
                    })
                );
                const validDescriptors = faceDescriptors.filter((d) => d !== null);
                setReferenceFaceDescriptors(validDescriptors);
                console.log("Descripteurs faciaux des utilisateurs chargés", validDescriptors);
            } catch (e) {
                console.error("Error fetching user data", e);
            }
        };

        if (isModelLoaded) {
            fetchUsersData();
        }
    }, [isModelLoaded]);

    useEffect(() => {
            const intervalId = setInterval(detectFaces, 250);
            return () => clearInterval(intervalId);
    }, [isFaceReconize, isModelLoaded, referenceFaceDescriptors]);


    useEffect(() => {
        loadModels();
    }, []);

    return (
        <>
            <Header />
            <div className="content">
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
                                videoConstraints={{ facingMode: "user" }}
                            />
                            <div className="overlay" id="overlay"></div>
                            {cameraAccepted && isModelLoaded && (
                                <div className="loading" id="loading">
                                    <Loading color="#1E289DB0" />
                                    <div className="loadingText">
                                        Reconnaissance facial en cours ...
                                    </div>
                                </div>
                            )}
                            <button className="retryBtn" id="retry" onClick={handleReload}>
                                RÉESSAYER
                            </button>

                            <canvas ref={canvasRef} />

                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Facial_Recognition;
