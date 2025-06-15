package com.jewelryapp.repository;

import com.jewelryapp.model.Material;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MaterialRepository extends MongoRepository<Material, String> {
    List<Material> findByType(String type);
}