package com.estacionamiento.config;

import com.zaxxer.hikari.HikariDataSource;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        String host = dotenv.get("DB_HOST", "localhost");
        String port = dotenv.get("DB_PORT", "5432");
        String dbName = dotenv.get("DB_NAME", "estacionamiento_db");
        String user = dotenv.get("DB_USER", "postgres");
        String pass = dotenv.get("DB_PASSWORD", "postgres");

        String url = String.format("jdbc:postgresql://%s:%s/%s", host, port, dbName);

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(url);
        ds.setUsername(user);
        ds.setPassword(pass);

        ds.setMaximumPoolSize(10);
        ds.setMinimumIdle(2);
        ds.setIdleTimeout(30000);
        ds.setConnectionTimeout(30000);

        System.out.println("✅ Conectado a la base de datos: " + url);
        return ds;
    }
}
