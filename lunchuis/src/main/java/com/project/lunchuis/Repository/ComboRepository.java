package com.project.lunchuis.Repository;

import com.project.lunchuis.Model.Combo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long> {
    // Aquí puedes agregar consultas personalizadas si lo necesitas
}
