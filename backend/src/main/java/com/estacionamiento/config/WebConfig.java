package com.estacionamiento.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Dotenv dotenv = Dotenv.configure()
        .directory("./")
        .ignoreIfMissing()
        .load();

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String frontendUrl = dotenv.get("FRONTEND_URL", "http://localhost:5173");

        registry.addMapping("/api/**")
                .allowedOrigins(frontendUrl)
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
