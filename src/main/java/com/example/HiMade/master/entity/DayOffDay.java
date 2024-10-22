package com.example.HiMade.master.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "day_off_day")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DayOffDay {
    @Id
    private String dayNo;

    private String dayOffType;

    @ManyToOne
    @JoinColumn(name = "store_no")
    @JsonBackReference
    private StoreAdmin storeAdmin;

    private String dayOffFixStatus;
    private String dayOffDay;



}
