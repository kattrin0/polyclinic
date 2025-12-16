package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;

public class ServiceEditDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer departmentId;

    public ServiceEditDTO() {}

    public ServiceEditDTO(Integer id, String name, String description,
                          BigDecimal price, Integer departmentId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.departmentId = departmentId;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }
}