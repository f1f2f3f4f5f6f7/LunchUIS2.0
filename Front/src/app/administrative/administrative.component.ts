import { Component } from '@angular/core';
import { PurchaseValue } from '../purchase-value';
import { PurchaseValueService } from '../purchase-value.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-administrative',
  templateUrl: './administrative.component.html',
  styleUrls: ['./administrative.component.css'],
  standalone: false
})
export class AdministrativeComponent {
  purchase: PurchaseValue | null = null;
  cantidadDia: number = 0;
  cantidadCena: number = 0;
  cantidadMes: number = 0;

  seccionVisible: string = 'cupos';

  // Menús
  mostrarMenu = false;
  servicioSeleccionado: string = '';
  diaSeleccionado: string = '';
  comboSeleccionado: string = '';
  fechaSeleccionada: string = '';

  // Combos
  combosAlmuerzo: string[] = ['Arroz con Pollo', 'Pasta Boloñesa', 'Lentejas con Carne'];
  combosCena: string[] = ['Sándwich de Pollo', 'Sopa de Verduras', 'Tortilla con Arroz'];
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Crear Menú
  nuevoMenu = {
    nombre: '',
    descripcion: '',
    imagen: null as File | null
  };

  constructor(
    private menuService: MenuService,
    private purchaseValueService: PurchaseValueService,
    private router: Router,
    private authService: AuthService
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

  obtenerCombosPorServicio(): string[] {
    return this.servicioSeleccionado === 'almuerzo'
      ? this.combosAlmuerzo
      : this.servicioSeleccionado === 'cena'
        ? this.combosCena
        : [];
  }

  confirmarMenu(): void {
    if (!this.servicioSeleccionado || !this.diaSeleccionado || !this.comboSeleccionado) {
      alert('Por favor seleccione un servicio, un día y un combo.');
      return;
    }

    console.log(`Servicio: ${this.servicioSeleccionado}, Día: ${this.diaSeleccionado}, Combo: ${this.comboSeleccionado}`);
    alert(`Asignación creada para ${this.servicioSeleccionado} el día ${this.diaSeleccionado} con el combo: ${this.comboSeleccionado}`);
  }

  confirmarCreacionMenu(): void {
    if (!this.nuevoMenu.nombre || !this.nuevoMenu.descripcion || !this.nuevoMenu.imagen) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nuevoMenu.nombre);
    formData.append('descripcion', this.nuevoMenu.descripcion);
    formData.append('imagen', this.nuevoMenu.imagen);

    this.menuService.crearMenu(formData).subscribe({
      next: (res) => {
        alert('Menú creado correctamente');
        this.nuevoMenu = { nombre: '', descripcion: '', imagen: null };
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el menú');
      }
    });
  }

  verMenusCreados(): void {
    alert('Aquí se mostrarán los menús creados.');
  }

  obtenerDefaultValuesLocalStorage(): void {
    this.purchaseValueService.consultarValores().subscribe(response => {
      console.log('Respuesta del backend:', response);
      if (response != null) {
        localStorage.setItem('purchaseValue', JSON.stringify(response));
        this.purchase = response;
        this.cantidadDia = this.purchase?.cantidadDiaria || 0;
        this.cantidadCena = this.purchase?.cantidadCena || 0;
        this.cantidadMes = this.purchase?.cantidadMensual || 0;
      } else {
        console.error('Error al cargar datos: ', response);
      }
    });
  }

  actualizar(): void {
    if (this.purchase) {
      this.purchase.cantidadDiaria = this.cantidadDia;
      this.purchase.cantidadCena = this.cantidadCena;
      this.purchase.cantidadMensual = this.cantidadMes;
      console.log('Datos antes de actualizar', this.purchase);
      this.purchaseValueService.actualizarValores(this.purchase).subscribe(
        response => {
          console.log(`Datos Actualizados: ${this.purchase}`);
        },
        error => {
          console.error(`Error al actualizar datos: ${this.purchase}`);
        }
      );
    } else {
      console.log('El objeto es nulo');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Método para manejar la imagen seleccionada desde el input file
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.nuevoMenu.imagen = file;
    }
  }
}
