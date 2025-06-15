package com.jewelryapp.repository;

import com.jewelryapp.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByCompletedAtBetween(LocalDateTime start, LocalDateTime end);
}