package com.example.polyclinic.polyclinic.repository;

import com.example.polyclinic.polyclinic.entity.UserData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserData, Integer> {

    Optional<UserData> findByEmail(String email);

    boolean existsByEmail(String email);

    // Фильтрация по роли с пагинацией
    Page<UserData> findByIsAdmin(Boolean isAdmin, Pageable pageable);

    // Если isAdmin = null, возвращаем всех
    @Query("SELECT u FROM UserData u WHERE :isAdmin IS NULL OR u.isAdmin = :isAdmin")
    Page<UserData> findAllFiltered(@Param("isAdmin") Boolean isAdmin, Pageable pageable);
}