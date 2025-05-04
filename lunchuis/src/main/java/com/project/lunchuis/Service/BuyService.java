package com.project.lunchuis.Service;

import com.project.lunchuis.Model.Buy;
import com.project.lunchuis.Model.Combo;
import com.project.lunchuis.Model.Notification;
import com.project.lunchuis.Model.QrCode;
import com.project.lunchuis.Model.Report;
import com.project.lunchuis.Repository.BuyRepository;
import com.project.lunchuis.Repository.ComboRepository;
import com.project.lunchuis.Repository.QrRepository;
import com.project.lunchuis.Repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BuyService {

    @Autowired
    private BuyRepository buyRepository;

    @Autowired
    private QrRepository qrRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private QrService qrService;

    @Autowired
    private ComboRepository comboRepository;

    public Buy createBuy(Buy buy) {
        if (buy.getUser() == null || buy.getUser().getId() == null) {
            throw new IllegalArgumentException("La compra debe estar asociada a un usuario válido");
        }

        if (buy.getDate() == null) {
            throw new IllegalArgumentException("La compra debe tener una fecha asignada");
        }

        if (buy.getCombo() == null || buy.getCombo().getId() == null) {
            throw new IllegalArgumentException("La compra debe estar asociada a un combo válido");
        }

        // Buscar y validar que el combo exista
        Optional<Combo> optionalCombo = comboRepository.findById(buy.getCombo().getId());
        if (optionalCombo.isEmpty()) {
            throw new IllegalArgumentException("El combo con ID " + buy.getCombo().getId() + " no existe");
        }
        buy.setCombo(optionalCombo.get());

        // Obtener o crear el reporte
        Report report = reportRepository.findByDate(buy.getDate())
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Report newReport = new Report();
                    newReport.setDate(buy.getDate());
                    return reportRepository.save(newReport);
                });

        buy.setReport(report);

        // Guardar la compra
        Buy savedBuy = buyRepository.save(buy);

        // Generar y asociar código QR
        QrCode qrCode = qrService.generateQrCode(savedBuy);
        savedBuy.setQrcode(qrCode);
        qrRepository.save(qrCode);

        // Crear y enviar notificación
        Notification notification = new Notification();
        notification.setDate(LocalDate.now());
        notification.setMessage("Gracias por tu compra. ID: " + savedBuy.getId());
        notificationService.createNotification(notification, savedBuy.getUser().getId());
        notificationService.sendNotification(notification);

        return savedBuy;
    }

    public List<Buy> getAllBuys() {
        return buyRepository.findAll();
    }

    public Optional<Buy> getBuyById(Long id) {
        return buyRepository.findById(id);
    }

    public Optional<Buy> updateBuy(Long id, Buy buyDetails) {
        return buyRepository.findById(id).map(buy -> {
            buy.setDate(buyDetails.getDate());
            buy.setHour(buyDetails.getHour());
            buy.setDinner(buyDetails.isDinner());
            buy.setLunch(buyDetails.isLunch());
            buy.setMonthly(buyDetails.isMonthly());

            if (buyDetails.getCombo() != null && buyDetails.getCombo().getId() != null) {
                comboRepository.findById(buyDetails.getCombo().getId()).ifPresent(buy::setCombo);
            }

            if (buyDetails.getQrcode() != null) {
                buy.setQrcode(buyDetails.getQrcode());
            }
            if (buyDetails.getReport() != null) {
                buy.setReport(buyDetails.getReport());
            }
            if (buyDetails.getUser() != null) {
                buy.setUser(buyDetails.getUser());
            }

            return buyRepository.save(buy);
        });
    }

    public boolean deleteBuy(Long id) {
        if (buyRepository.existsById(id)) {
            buyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
