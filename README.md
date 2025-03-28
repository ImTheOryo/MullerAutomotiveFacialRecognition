
# Reconnaissance Facial

[CODA] - Innovatec

Voici un projet de Reconnaissance Facial en **React.js**, **Rust** avec FrameWork **Axum**, et une base de donnée en **PostgreSQL**.

# Lancement du projet

- Cloner le repos avec la commande suivant 

    ```git clone https://github.com/ImTheOryo/MullerAutomotiveFacialRecognition.git```

- Créer la base de donnée avec le nom que vous souhaitez avec la commande suivante
    - Pour la table administrateur
        ```CREATE TABLE admin ( id SERIAL PRIMARY KEY, username VARCHAR NOT NULL, password VARCHAR NOT NULL);```
    
    - Pour la table user
        ``` CREATE TABLE user ( id SERIAL PRIMARY KEY, first_name VARCHAR NOT NULL, last_name VARCHAR NOT NULL, facial_data TEXT NOT NULL);```

- Front-end
    - La commande ```npm install``` pour installer toutes les dépendances
