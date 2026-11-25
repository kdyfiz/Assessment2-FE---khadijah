package com.assessment.favorites;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Optional favourites API for Assessment 2.
 * Run: {@code mvn spring-boot:run} from {@code backend/} (port 8081).
 * Default DB: file H2 under {@code backend/data/}. MySQL: {@code -Dspring-boot.run.profiles=mysql}.
 */
@SpringBootApplication
public class PlaceFavoritesApplication {

  public static void main(String[] args) {
    SpringApplication.run(PlaceFavoritesApplication.class, args);
  }
}
