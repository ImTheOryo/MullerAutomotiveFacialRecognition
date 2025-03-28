
use axum::{
    extract::{Path, State},
    http::{StatusCode, Method},
    routing::{get, post},
    Json,
    Router
};
use axum::routing::{delete, patch};
use bcrypt::{hash, verify};
use serde::{Serialize, Deserialize};
use serde_json::{json, Value};
use sqlx::{postgres::PgPoolOptions, FromRow, PgPool};
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};


    #[tokio::main]
    async fn main() {
        dotenvy::dotenv().expect("Failed to read .env file");

        let server_address = std::env::var("SERVER_ADDRESS").unwrap_or("127.0.0.1:5000".to_owned());
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL is not set");

        let db_pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&database_url)
            .await
            .expect("Failed to connect to the database");

        let listener = TcpListener::bind(server_address)
            .await
            .expect("Could not create TCP listener");

        println!("Listening on {}", listener.local_addr().unwrap());

        let cors = CorsLayer::new()
            .allow_methods(vec![Method::GET, Method::POST, Method::PUT, Method::PATCH, Method::DELETE])
            .allow_origin(Any)
            .allow_headers(Any);

        let app = Router::new()
            .route("/users", get(get_users).post(create_user))
            .route("/user/{id}", delete(delete_user).patch(update_user).get(get_user))
            .route("/verify", get(verify_user).post(create_user_token))
            .route("/login", post(verify_admin))
            .route("/create", post(create_admin))
            .layer(cors)
            .with_state(db_pool);

        axum::serve(listener, app)
            .await
            .expect("Error serving application");
    }

    #[derive(Deserialize)]
    struct AdminLoginReq{
        username: String,
        password: String
    }

    #[derive(Deserialize, FromRow, Serialize)]
    struct AdminRow {
        id: i32,
        username: String,
        password: String,
    }

    #[derive(Deserialize, FromRow)]
    struct VerifyUserReq {
        facial_data: String,
    }

    #[derive(Serialize, FromRow)]
    struct CreateUserResponse {
        id: i32,
    }
    #[derive(Deserialize)]
    struct CreateUserToken {
        id: i32,
    }

    #[derive(Deserialize)]
    struct UpdateUserReq {
        first_name: Option<String>,
        last_name: Option<String>,
        facial_data: Option<String>,
    }

    #[derive(Serialize, Deserialize, FromRow)]
    struct UserRow {
        id: i32,
        first_name: String,
        last_name: String,
        facial_data: String,
    }

    #[derive(Deserialize, Debug)]
    struct CreateUserReq {
        first_name: String,
        last_name: String,
        facial_data: String,
    }

    #[derive(Serialize, FromRow)]
    struct GetUserToVerify{
        facial_data: String,
    }

    pub async fn create_user(
        State(pg_pool): State<PgPool>,
        Json(user): Json<CreateUserReq>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {





        let new_user = sqlx::query_as::<_, CreateUserResponse>(
            "INSERT INTO users (first_name, last_name, facial_data) VALUES ($1, $2, $3) RETURNING id"
        )
            .bind(&user.first_name.trim())
            .bind(&user.last_name.trim())
            .bind(&user.facial_data.trim())
            .fetch_one(&pg_pool)
            .await
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({"success": false, "message": err.to_string()}).to_string(),
                )
            })?;
        Ok((
            StatusCode::CREATED,
            json!({ "success": true, "data": new_user }).to_string(),
        ))
    }


    pub async fn get_users(
        State(db_pool): State<PgPool>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {
        let users = sqlx::query_as::<_, UserRow>("SELECT * FROM users ORDER BY id")
            .fetch_all(&db_pool)
            .await
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({"success": false, "message": err.to_string()}).to_string(),
                )
            })?;

        Ok((StatusCode::OK, json!({ "success": true, "data": users }).to_string()))
    }

    pub async fn update_user(
        State(pg_pool): State<PgPool>,
        Path(id): Path<i32>,
        Json(user): Json<UpdateUserReq>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {

        sqlx::query!(
            "UPDATE users SET
             first_name = COALESCE($2, first_name),
             last_name = COALESCE($3, last_name),
             facial_data = COALESCE($4, facial_data)
            WHERE id = $1",
            id, user.first_name, user.last_name, user.facial_data
        )
            .execute(&pg_pool)
            .await
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({"success": false, "message": e.to_string()}).to_string(),
                )
            })?;

        Ok((StatusCode::OK, json!({ "success": true }).to_string()))
    }

    pub async fn delete_user(
        State(pg_pool): State<PgPool>,
        Path(id): Path<i32>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {
        sqlx::query!("DELETE FROM users WHERE id = $1", id)
            .execute(&pg_pool)
            .await
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({"success": false, "message": err.to_string()}).to_string(),
                )
            })?;

        Ok((StatusCode::OK, json!({ "success": true }).to_string()))
    }


    pub async fn get_user(
        State(db_pool): State<PgPool>,
        Path(id): Path<i32>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {
        let users = sqlx::query_as::<_, UserRow>("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_all(&db_pool)
            .await
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({"success": false, "message": err.to_string()}).to_string(),
                )
            })?;

        Ok((StatusCode::OK, json!({ "success": true, "data": users }).to_string()))
    }

    pub async fn verify_user(
        State(db_pool): State<PgPool>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {
        let users = sqlx::query_as::<_, GetUserToVerify>("SELECT facial_data FROM users")
            .fetch_all(&db_pool)
            .await
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({"success": false, "message": err.to_string()}).to_string(),
                )
            })?;

        Ok((StatusCode::OK, json!({ "success": true, "data": users }).to_string()))
    }

    pub async fn create_user_token (
        State(db_pool): State<PgPool>,
        Json(user): Json<CreateUserToken>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {
        let users = sqlx::query_as::<_, UserRow>("SELECT * FROM users ORDER BY id")
            .fetch_all(&db_pool)
            .await
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({"success": false, "message": err.to_string()}).to_string(),
                )
            })?;

        let number = user.id;
        let index : usize = number.try_into().unwrap();


        println!("user id : {}", users[index].id );

        Ok((StatusCode::OK, json!({"token": users[index]}).to_string()))

    }

    pub async fn verify_admin (
        State(db_pool): State<PgPool>,
        Json(admin): Json<AdminLoginReq>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {
        let admin_row = sqlx::query_as::<_, AdminRow>("SELECT * FROM admin WHERE username = $1")
            .bind(admin.username.trim())
            .fetch_one(&db_pool)
            .await
            .map_err(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({"success": false, "message": err.to_string()}).to_string(),
            )
        })?;

        let verification = verify(admin.password, admin_row.password.as_str()).unwrap();
        if verification {
            Ok((StatusCode::OK, json!({"success": true, "auth": true}).to_string()))
        }else {
            Ok((StatusCode::OK, json!({"success": false, "auth": false}).to_string()))
        }
    }

    pub async fn create_admin (
        State(db_pool): State<PgPool>,
        Json(admin): Json<AdminLoginReq>,
    ) -> Result<(StatusCode, String), (StatusCode, String)> {
        let password_hash = hash(admin.password.trim(), 15).unwrap();
        println!("password : {}", password_hash);

        let new_admin = sqlx::query_as::<_, CreateUserResponse>(
            "INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING id"
        )
            .bind(&admin.username.trim())
            .bind(&password_hash)
            .fetch_one(&db_pool)
            .await
            .map_err(|err| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    json!({"success": false, "message": err.to_string()}).to_string(),
                )
            })?;

        Ok((
            StatusCode::CREATED,
            json!({ "success": true, "data": new_admin }).to_string(),
        ))

    }
