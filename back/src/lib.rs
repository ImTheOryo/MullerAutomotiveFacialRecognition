mod helpers;


use std::sync::Arc;

use axum::{middleware, routing::get, routing::delete, Router};
use tower_http::cors::CorsLayer;

    #[derive(Debug, Clone, serde::Deserialize, serde::Serialize)]
    pub struct Setup {
        pub pg_host: String,
        pub pg_port: u16,
        pub pg_dbname: String,
        pub pg_user: String,
        pub pg_password: String,

        pub pg_retry_delay: u64,
        pub pg_retry_number: u16,
    }

    pub async fn init_app (
        setup: Setup,
        base_url: &str
    ) -> Router {
        let app_state = helpers::state::init_state(&setup).await;

        let routes = Router::new()
            .route("/users", get(get_users).post(create_user))
            .route("/users/{id}", delete(delete_user).patch(update_user).get(get_user))
            .route("/verify", get(verify_user))
            .layer(CorsLayer::permissive())
            .with_state(app_state.clone());

        Router::new().nest(base_url, routes)
    }