package com.project.lunchuis.Service;

import com.project.lunchuis.Model.Combo;
import com.project.lunchuis.Repository.ComboRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComboService {

    @Autowired
    private ComboRepository comboRepository;

    // Método para crear un Combo
    public Combo createCombo(String name, String description, int price) {
        Combo combo = new Combo();
        combo.setName(name);
        combo.setDescription(description);
        combo.setPrice(price);
        combo.incrementPurchaseCount();  // Incrementar el contador de compras si lo deseas

        // Guardar el combo en la base de datos
        return comboRepository.save(combo);
    }

    // Método para obtener todos los Combos
    public List<Combo> getAllCombos() {
        return comboRepository.findAll();
    }
}
