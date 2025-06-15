package com.jewelryapp.service;

import com.jewelryapp.model.Order;
import com.jewelryapp.model.Product;
import com.jewelryapp.model.Material;
import com.jewelryapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private MaterialService materialService;

    public Order createOrder(String productId, String customerName, String customerPhone) {
        Product product = productService.getProductById(productId);

        // Перевірка наявності матеріалів
        for (Map.Entry<String, Double> entry : product.getMaterialsRequired().entrySet()) {
            if (!materialService.checkAvailability(entry.getKey(), entry.getValue())) {
                throw new RuntimeException("Insufficient materials for product: " + product.getName());
            }
        }

        // Списання матеріалів
        Double materialCost = 0.0;
        for (Map.Entry<String, Double> entry : product.getMaterialsRequired().entrySet()) {
            materialService.updateQuantity(entry.getKey(), -entry.getValue());
            // Підрахунок собівартості матеріалів для визначення прибутку
            // Тут можна додати логіку розрахунку собівартості
        }

        Double profit = product.getPrice() - materialCost;

        Order order = new Order(productId, customerName, customerPhone, product.getPrice(), profit);
        return orderRepository.save(order);
    }

    public Order completeOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(Order.OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<Order> getActiveOrders() {
        return orderRepository.findByStatus(Order.OrderStatus.ACTIVE);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Double getTotalProfit(LocalDateTime start, LocalDateTime end) {
        List<Order> completedOrders = orderRepository.findByCompletedAtBetween(start, end);
        return completedOrders.stream()
                .mapToDouble(Order::getProfit)
                .sum();
    }
}