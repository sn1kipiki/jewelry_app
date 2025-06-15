package com.jewelryapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class ConnectionTestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        try {
            mongoTemplate.getDb().listCollectionNames().first();
            return ResponseEntity.ok("✅ Підключення до MongoDB успішне.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Помилка підключення: " + e.getMessage());
        }
    }
}