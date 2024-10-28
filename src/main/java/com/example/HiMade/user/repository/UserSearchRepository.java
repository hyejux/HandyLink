package com.example.HiMade.user.repository;

import com.example.HiMade.user.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSearchRepository extends JpaRepository<Category, Integer> {

    @Query("SELECT c.serviceName, c.storeNo FROM Category c WHERE c.categoryLevel = :level")
    List<Object[]> findServiceNameAndStoreNoByCategoryLevel(int level);
}



