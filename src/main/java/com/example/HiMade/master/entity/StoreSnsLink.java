package com.example.HiMade.master.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "store_sns_link")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class StoreSnsLink {
    private String snsLink;
    private String snsName;

    @ManyToOne
    @JoinColumn(name = "store_no")
    @JsonBackReference
    private StoreAdmin storeAdmin;

    @Id
    private Long storeSnsNo;


}
