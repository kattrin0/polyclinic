package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;

public class ServiceDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private String departmentName;

    public ServiceDTO() {}

    public ServiceDTO(Integer id, String name, String description,
                      BigDecimal price, String departmentName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.departmentName = departmentName;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
}