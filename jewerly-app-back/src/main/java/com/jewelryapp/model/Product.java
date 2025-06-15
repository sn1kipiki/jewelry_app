package com.jewelryapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private Double price;
    private String photoUrl;
    private Map<String, Double> materialsRequired; // materialId -> quantity

    public Product() {}

    public Product(String name, String description, Double price, Map<String, Double> materialsRequired) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.materialsRequired = materialsRequired;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public Map<String, Double> getMaterialsRequired() { return materialsRequired; }
    public void setMaterialsRequired(Map<String, Double> materialsRequired) { this.materialsRequired = materialsRequired; }
}