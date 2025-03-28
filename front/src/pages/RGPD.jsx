import React from 'react';
import Header from '../components/Header';
import '../assets/style/RGPD.css';

const RGPD = () => {
    return (
        <>
            <Header />
            <div className="container-rgpd">
                <h1>Politique de Confidentialité</h1>
                <p>
                    Chez <strong>Muller Automotive</strong>, la protection des données personnelles de nos collaborateurs est une priorité.
                    Cette politique de confidentialité explique comment les données sont collectées, utilisées et protégées dans le cadre de l'utilisation de notre
                    application de reconnaissance faciale, destinée exclusivement à un usage interne pour les contrôles techniques des véhicules.
                </p>

                <h2>Collecte des Informations</h2>
                <p>
                    Dans le cadre de l’utilisation de l’application, nous collectons les données suivantes :
                </p>
                <ul>
                    <li>Données faciales (empreintes faciales extraites des images)</li>
                    <li>Identifiants internes associés (matricule, nom, prénom)</li>
                    <li>Horodatages et journaux d'accès liés à l'utilisation</li>
                </ul>
                <p>
                    Ces données sont collectées uniquement lors de l'utilisation de l'application dans les ateliers techniques de Muller Automotive.
                </p>

                <h2>Utilisation des Informations</h2>
                <p>
                    Les données collectées sont utilisées uniquement aux fins suivantes :
                </p>
                <ul>
                    <li>Vérification de l'identité des techniciens habilités</li>
                    <li>Traçabilité des interventions techniques</li>
                    <li>Renforcement de la sécurité interne et de la conformité</li>
                </ul>
                <p>Aucune donnée n’est utilisée à des fins commerciales ou publicitaires.</p>

                <h2>Base Légale du Traitement</h2>
                <p>
                    Le traitement repose sur l’intérêt légitime de l’entreprise à sécuriser ses processus, ainsi que sur le consentement explicite des salariés concernés.
                </p>

                <h2>Protection des Informations</h2>
                <p>
                    Nous mettons en œuvre des mesures strictes de sécurité :
                </p>
                <ul>
                    <li>Cryptage des données biométriques dès leur capture</li>
                    <li>Stockage sur serveurs sécurisés localement</li>
                    <li>Accès restreint aux personnes habilitées (Direction Technique et DPO)</li>
                    <li>Aucune transmission à des tiers non autorisés</li>
                </ul>

                <h2>Durée de Conservation</h2>
                <p>
                    Les données sont conservées tout le long de votre activité au sein de l'entreprise, puis automatiquement supprimées sauf obligation légale contraire.
                </p>

                <h2>Vos Droits</h2>
                <p>
                    Conformément au RGPD, chaque salarié concerné dispose des droits suivants :
                </p>
                <ul>
                    <li>Droit d’accès, rectification, suppression</li>
                    <li>Droit à la limitation du traitement</li>
                    <li>Droit d’opposition</li>
                    <li>Droit de retirer son consentement à tout moment</li>
                </ul>
                <p>
                    Pour exercer vos droits, contactez notre Délégué à la Protection des Données (DPO) : <a href="mailto:dpo@muller-automotive.com">dpo@muller-automotive.com</a>
                </p>
            </div>
        </>
    );
};

export default RGPD;
