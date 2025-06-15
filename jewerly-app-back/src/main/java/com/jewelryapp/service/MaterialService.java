package com.jewelryapp.service;

import com.jewelryapp.model.Material;
import com.jewelryapp.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public Material addMaterial(Material material) {
        return materialRepository.save(material);
    }

    public Material updateQuantity(String id, Double quantityChange) {
        Optional<Material> materialOpt = materialRepository.findById(id);
        if (materialOpt.isPresent()) {
            Material material = materialOpt.get();
            material.setQuantity(material.getQuantity() + quantityChange);
            return materialRepository.save(material);
        }
        throw new RuntimeException("Material not found");
    }

    public boolean checkAvailability(String materialId, Double requiredQuantity) {
        Optional<Material> materialOpt = materialRepository.findById(materialId);
        return materialOpt.isPresent() && materialOpt.get().getQuantity() >= requiredQuantity;
    }
}