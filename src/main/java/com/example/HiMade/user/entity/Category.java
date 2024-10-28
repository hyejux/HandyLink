package com.example.HiMade.user.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "category")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int categoryId;

    private int categoryLevel;
    private int parentCategoryId;
    private String serviceName;
    private int servicePrice;
    private String serviceContent;
    private String storeId;
    private int storeNo;
    private LocalDateTime serviceStart;
    private int imageId;

    private String imageUrl;
    private String imageDescription;
}
