use crate::Setup;

use std::sync::Arc;

    #[derive(Clone)]
    pub struct AppState {
        pub pg_pool: deadpool_postgres::Pool,
    }

    pub async fn init_state(setup: &Setup) -> Arc<AppState> {
        let pg_pool = crate::helpers::postgres::create_pool(setup).await;

        Arc::new(AppState { pg_pool })
    }