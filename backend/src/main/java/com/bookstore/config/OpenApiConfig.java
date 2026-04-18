package com.bookstore.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger configuration with JWT Bearer authentication support.
 * Accessible at /swagger-ui.html when the application is running.
 */
@Configuration
public class OpenApiConfig {

    /**
     * Configure OpenAPI documentation with JWT security scheme.
     * @return configured OpenAPI bean
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Bookstore API")
                        .description("Full-stack Bookstore Application REST API with JWT Authentication")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Bookstore Admin")
                                .email("admin@bookstore.com")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .bearerFormat("JWT")
                                        .scheme("bearer")
                                        .description("Enter JWT token (without 'Bearer ' prefix)")));
    }
}
