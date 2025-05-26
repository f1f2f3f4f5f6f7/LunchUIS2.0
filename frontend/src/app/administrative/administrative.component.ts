import { OnInit, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Component } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PurchaseValue } from '../purchase-value';
import { PurchaseValueService } from '../purchase-value.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MenuService } from '../menu.service.spec';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-administrative',
  templateUrl: './administrative.component.html',
  styleUrls: ['./administrative.component.css'],
  standalone: false
})
export class AdministrativeComponent implements OnInit, AfterViewInit{
  private activeContainer: HTMLElement | null = null;
  purchase: PurchaseValue | null = null;
  cantidadDia: number = 0;
  cantidadCena: number = 0;
  cantidadMes: number = 0;

  user!: Usuario;
  seccionVisible: string = 'cupos';

  // Menús
  mostrarMenu = false;
  servicioSeleccionado: string = '';
  diaSeleccionado: string = '';
  comboSeleccionado: string = '';
  fechaSeleccionada: string = '';

  // Combos
  combos: any[] = [];
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Crear Menú
  nuevoMenu = {
    nombre: '',
    descripcion: '',
    precio: 0,
  };

  constructor(
    private renderer: Renderer2,
    private menuService: MenuService,
    private purchaseValueService: PurchaseValueService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarCombosDesdeBackend(); //para cargar los combos desde el backend
      this.obtenerUsuarioDeLocalStorage();
      this.obtenerDefaultValuesLocalStorage();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    const btnToggle = document.getElementById('toggleButton');
    const btnNotification = document.getElementById('notificationButton');
    const btnProfile = document.getElementById('profileButton');
    const infoContainer = document.getElementById('infoContainer');
    const notificationContainer = document.getElementById('notificationContainer');
    const profileContainer = document.getElementById('profileContainer');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    if (btnToggle) this.renderer.listen(btnToggle, 'click', (event) => {
      if (infoContainer) this.toggleContainer(event, infoContainer);
    });
    if (btnNotification) this.renderer.listen(btnNotification, 'click', (event) => {
      if (notificationContainer) this.toggleContainer(event, notificationContainer);
    });
    if (btnProfile) this.renderer.listen(btnProfile, 'click', (event) => {
      if (profileContainer) this.toggleContainer(event, profileContainer);
    });

    this.renderer.listen(document, 'click', () => this.closeActiveContainer());
    if (infoContainer) this.renderer.listen(infoContainer, 'click', (event) => event.stopPropagation());
    if (notificationContainer) this.renderer.listen(notificationContainer, 'click', (event) => event.stopPropagation());
    if (profileContainer) this.renderer.listen(profileContainer, 'click', (event) => event.stopPropagation());

    if (btnCerrarSesion) this.renderer.listen(btnCerrarSesion, 'click', () => this.showModal('Comprar Combo', 'Aquí puedes proceder con la compra del combo.'));

    const lunchUIS = document.getElementById('lunchUIS');
    if (lunchUIS) lunchUIS.addEventListener('click', () => location.reload());
  }

  private showModal(title: string, message: string): void {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modalOverlay) modalOverlay.style.display = 'flex';
  }

  private toggleContainer(event: MouseEvent, container: HTMLElement): void {
    event.stopPropagation();
    if (this.activeContainer && this.activeContainer !== container) {
      this.closeActiveContainer();
    }

    if (container.style.display === 'none' || container.style.display === '') {
      container.style.display = 'block';
      this.activeContainer = container;
    } else {
      this.closeActiveContainer();
    }
  }

  private closeActiveContainer(): void {
    if (this.activeContainer) {
      this.activeContainer.style.display = 'none';
      this.activeContainer = null;
    }
  }

  mostrarSeccion(seccion: string): void {
    this.seccionVisible = seccion;
  }

  toggleMenu(): void {
    this.mostrarMenu = !this.mostrarMenu;
    
  }

  // Logica para cargar los combos desde el backend
  cargarCombosDesdeBackend(): void {
  this.menuService.obtenerCombos().subscribe({
    next: (res) => {
      console.log('Combos obtenidos:', res);
      this.combos = res;
    },
    error: (err) => {
      console.error('Error al obtener combos:', err);
      alert('Error al obtener combos del backend.');
    }
  });
}


  // ver todos los combos sin que joda por el servicio
  obtenerCombosPorServicio(): any[] {
  return this.combos;
}


  //actualizacion del confirmar menu que no tenia nada de logica
  confirmarMenu(): void {
  if (!this.servicioSeleccionado || !this.fechaSeleccionada || !this.comboSeleccionado) {
    alert('Por favor seleccione un servicio, un día y un combo.');
    return;
  }

  // Llamada real al backend para obtener los combos
  this.menuService.obtenerCombos().subscribe({
    next: (res) => {
      console.log('Combos obtenidos:', res);

      // Buscar el combo seleccionado en la respuesta
      const comboEncontrado = res.find((combo: any) => combo.name === this.comboSeleccionado);

      if (comboEncontrado) {
        alert(`Asignación creada para ${this.servicioSeleccionado} el día ${this.fechaSeleccionada} con el combo: ${comboEncontrado.name}`);
      } else {
        alert('No se encontró el combo seleccionado en la lista del backend.');
      }
    },
    error: (err) => {
      console.error('Error al obtener combos:', err);
      alert('Error al obtener combos del backend.');
    }
  });
}

  confirmarCreacionMenu(): void {

    // Validación de campos
    if (!this.nuevoMenu.nombre || !this.nuevoMenu.descripcion || !this.nuevoMenu.precio) 
      {
      alert('Por favor, completa todos los campos.');
      return;
      }
    //Declaración del cuerpo de la solicitud para el formato JSON
    const body = {
      name: this.nuevoMenu.nombre,
      description: this.nuevoMenu.descripcion,
      price: this.nuevoMenu.precio
    };

    // Llamada al servicio para crear el menú
    this.menuService.crearMenu(body).subscribe({
      next: (res) => {
        alert('Menú creado correctamente');
        // Limpiar el formulario después de crear el menú
        this.nuevoMenu = { nombre: '', descripcion: '', precio: 0 };
        this.cargarCombosDesdeBackend(); //para cargar los combos desde el backend
      },
      error: (err) => {
        console.error('Error al crear el menú:', err);
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

  obtenerUsuarioDeLocalStorage(): void {
    const usuarioString = localStorage.getItem('usuarioRegistrado');
    if (usuarioString) {
      this.user = JSON.parse(usuarioString);
      console.log('Usuario cargado desde localStorage:', this.user);
    } else {
      console.log('No se encontró usuario en localStorage');
    }
  }
}

