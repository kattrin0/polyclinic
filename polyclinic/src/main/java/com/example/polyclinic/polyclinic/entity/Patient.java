package com.example.polyclinic.polyclinic.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserData user;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "snils", nullable = false, unique = true, length = 20)
    private String snils;

    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    public Patient() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public UserData getUser() { return user; }
    public void setUser(UserData user) { this.user = user; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getSnils() { return snils; }
    public void setSnils(String snils) { this.snils = snils; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getFullName() {
        return user != null ? user.getFullName() : null;
    }
}