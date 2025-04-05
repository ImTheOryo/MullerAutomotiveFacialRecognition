use crate::Setup;

use tracing::{ error, info, warn};

use core::time;
use std::thread;

use deadpool_postgres::{Config, Pool, Runtime};
use deadpool_postgres::tokio_postgres::NoTls;

fn create_config (
        setup: &Setup
    ) -> Config {
        let mut conf = Config::new();

        conf.host = Some(setup.pg_host.clone());
        conf.port = Some(setup.pg_port.clone());
        conf.dbname = Some(setup.pg_dbname.clone());
        conf.user = Some(setup.pg_user.clone());
        conf.password = Some(setup.pg_password.clone());

        conf
    }

    pub async fn create_pool (
        setup: &Setup
    ) -> Pool {
        let config = create_config(setup);

        info!(
        "Creating PG Pool @ {}:{}/{}",
        config.host.as_ref().unwrap(),
        config.port.unwrap(),
        config.dbname.as_ref().unwrap()
    );

        let pool = {
            let delay = time::Duration::from_secs(setup.pg_delay);
            let max_counter = setup.pg_retry_number;

            let mut counter = 0;

            loop {
                counter += 1;

                if counter > (max_counter - 1) {
                    error!(
                        "Unable to connect to PG Pool {} times, panicking...",
                        counter
                    );
                    panic!("Unable to create PG Pool !");
                }

                let pool = match config.create_pool(Some(Runtime::Tokio1), NoTls){
                    Ok(pool) => pool,
                    Err(_) => panic!("Unable to create PG Pool !")
                };

                if pool.get().await.is_ok() {
                    break pool;
                }

                warn!(
                    "Unable to connect to PG Pool {} times, retrying in {} seconds...",
                    counter,
                    delay.as_secs()
                );

                thread::sleep(delay);

            }
        };

        pool
    }