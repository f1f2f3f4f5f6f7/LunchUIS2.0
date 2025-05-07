import { Component } from '@angular/core';
import { PurchaseValue } from '../purchase-value';
import { PurchaseValueService } from '../purchase-value.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-administrative',
  templateUrl: './administrative.component.html',
  styleUrls: ['./administrative.component.css'],
  standalone: false
})
export class AdministrativeComponent {
  mostrarMenu = false;
  seccionVisible:string='menu';
  purchase: PurchaseValue | null = null;
  cantidadDia = 0;
  cantidadCena = 0;
  cantidadMes = 0;

  servicioSeleccionado = '';
  diaSeleccionado = '';
  fechaSeleccionada = '';
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  constructor(
    private purchaseValueService: PurchaseValueService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.obtenerDefaultValuesLocalStorage();
  }

  mostrarSeccion(seccion: string): void {
    this.seccionVisible = seccion;
  }

  toggleMenu(): void {
    this.mostrarMenu = !this.mostrarMenu;
  }

  confirmarMenu(): void {
    if (!this.servicioSeleccionado || !this.diaSeleccionado || !this.fechaSeleccionada) {
      alert('Por favor seleccione un servicio, un día y una fecha.');
      return;
    }

    console.log(`Servicio: ${this.servicioSeleccionado}, Día: ${this.diaSeleccionado}, Fecha: ${this.fechaSeleccionada}`);
    alert(`Asignación creada para ${this.servicioSeleccionado} el día ${this.diaSeleccionado} con fecha ${this.fechaSeleccionada}`);
  }

  verMenusCreados(): void {
    alert('Aquí se mostrarán los menús creados.');
  }

  obtenerDefaultValuesLocalStorage(): void {
    this.purchaseValueService.consultarValores().subscribe(response => {
      if (response) {
        localStorage.setItem('purchaseValue', JSON.stringify(response));
        this.purchase = response;
        this.cantidadDia = this.purchase.cantidadDiaria || 0;
        this.cantidadCena = this.purchase.cantidadCena || 0;
        this.cantidadMes = this.purchase.cantidadMensual || 0;
      } else {
        console.error('Error al cargar datos del backend.');
      }
    });
  }

  actualizar(): void {
    if (!this.purchase) {
      console.log('El objeto es nulo');
      return;
    }

    this.purchase.cantidadDiaria = this.cantidadDia;
    this.purchase.cantidadCena = this.cantidadCena;
    this.purchase.cantidadMensual = this.cantidadMes;

    this.purchaseValueService.actualizarValores(this.purchase).subscribe(
      () => console.log('Datos actualizados correctamente.'),
      error => console.error('Error al actualizar datos:', error)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
