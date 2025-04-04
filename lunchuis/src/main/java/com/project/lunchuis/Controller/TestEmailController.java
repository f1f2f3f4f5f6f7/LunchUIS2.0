package com.project.lunchuis.Controller;

import com.project.lunchuis.Model.Buy;
import com.project.lunchuis.Service.BuyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;



import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test-email")
public class TestEmailController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping
    public ResponseEntity<String> sendTestEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("TUCORREO@GMAIL.COM");
            message.setSubject("Correo de prueba");
            message.setText("Este es un correo de prueba desde Spring Boot");
            message.setFrom("castrokevin312@gmail.com");

            mailSender.send(message);
            return ResponseEntity.ok("Correo enviado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al enviar: " + e.getMessage());
        }
    }
}
