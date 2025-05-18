package com.project.lunchuis.Controller;

import com.project.lunchuis.Model.Combo;
import com.project.lunchuis.Service.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/combos")  // Define la ruta base para todos los endpoints relacionados con combos
public class ComboController {

    @Autowired
    private ComboService comboService;

    // Endpoint para crear un Combo
    @PostMapping
    public Combo createCombo(@RequestBody Combo combo) {
        return comboService.createCombo(combo.getName(), combo.getDescription(), combo.getPrice());
    }

    // Endpoint para listar todos los Combos
    @GetMapping
    public List<Combo> getAllCombos() {
        return comboService.getAllCombos();
    }
}
