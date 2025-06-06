package com.project.lunchuis.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "buy")
public class Buy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime hour;

    private boolean dinner;
    private boolean lunch;
    private boolean monthly;

    // Relación con QR
    @OneToOne(mappedBy = "buy", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private QrCode qrcode;

    public void setQrcode(QrCode qrcode) {
        this.qrcode = qrcode;
        if (qrcode != null) {
            qrcode.setBuy(this);
        }
    }

    // Relación con Report
    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    @JsonIgnore
    private Report report;

    // Relación con User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "combo_id", nullable = false)
    private Combo combo;
}
