package com.example.HiMade.master.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "day_off_set")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DayOffSet {
    @Id
    private String setNo;

    @ManyToOne
    @JoinColumn(name = "store_no")
    @JsonBackReference
    private Store store;

    private String dayOffStart;
    private String dayOffEnd;
}
