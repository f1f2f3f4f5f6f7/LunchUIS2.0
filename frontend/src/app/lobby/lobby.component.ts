import { Component, OnInit, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../usuario';
import { PurchaseValueService } from '../purchase-value.service';
import { PurchaseValue } from '../purchase-value';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Buy } from '../buy';
import { BuyService } from '../buy.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, AfterViewInit {
  title = 'Proyecto';
  private activeContainer: HTMLElement | null = null;
  user!: Usuario;
  purchase: PurchaseValue = { cantidadDiaria: 0, cantidadCena: 0, cantidadMensual: 0, valorCena: 0, valorDiario: 0, valorMensual: 0 };
  buy!: Buy;
  isChecked1: boolean = false;
  isChecked2: boolean = false;
  currentDate: Date = new Date();
  //hora actual
  horaActual: string = '';
  //Contador del combo
  comboId: number = 1;
  // Contador para el QR
  contador_qr: number = 1;
  constructor(
    private renderer: Renderer2,
    private purchaseValueService: PurchaseValueService,
    private router: Router,
    private authService: AuthService,
    private buyService: BuyService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(this.actualizarReloj.bind(this), 1000);
      setInterval(this.actualizarHoraDigital.bind(this), 1000);
      this.obtenerUsuarioDeLocalStorage();
      this.obtenerDefaultValuesLocalStorage();
    }
  }
  obtenerDefaultValuesLocalStorage(): void {
    this.purchaseValueService.consultarValores().subscribe(response => {
      console.log('Respuesta del backend:', response);
      if (response != null) {
        console.log('Datos por defecto:', response);
        // Guarda el usuario en el almacenamiento local
        localStorage.setItem('purchaseValue', JSON.stringify(response));
        this.purchase = response;
      } else {
        console.error('Error al cargar datos: ', response);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupEventListeners();
      this.actualizarReloj(); // Llamar una vez al inicio
      this.actualizarHoraDigital(); // Llamar para mostrar la hora inmediatamente
    }
  }

  private setupEventListeners(): void {
    const btnToggle = document.getElementById('toggleButton');
    const btnNotification = document.getElementById('notificationButton');
    const btnProfile = document.getElementById('profileButton');
    const infoContainer = document.getElementById('infoContainer');
    const notificationContainer = document.getElementById('notificationContainer');
    const profileContainer = document.getElementById('profileContainer');

    const closeModalButton = document.getElementById('closeModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    const btnMisCompras = document.getElementById('btnMisCompras');

    const btnComprarCombo = document.getElementById('btnComprarCombo');
    const modalOverlayCompra = document.getElementById('modalOverlayCompra');
    const confirmarCompraButton = document.getElementById('confirmarCompraButton');
    const cancelarCompraButton = document.getElementById('cancelarCompraButton');

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
    if (btnMisCompras) this.renderer.listen(btnMisCompras, 'click', () => this.showModal('Mis Compras', 'Aquí se mostrarán tus compras realizadas.'));
    if (closeModalButton) this.renderer.listen(closeModalButton, 'click', () => this.closeModal());
    if (modalOverlay) this.renderer.listen(modalOverlay, 'click', (event) => {
      if (event.target === modalOverlay) {
        this.closeModal();
      }
    });

    if (btnComprarCombo) this.renderer.listen(btnComprarCombo, 'click', () => {
      if (modalOverlayCompra) this.showModalCompra(modalOverlayCompra);
    });
    if (confirmarCompraButton) this.renderer.listen(confirmarCompraButton, 'click', () => {
      alert('¡Compra confirmada!');
      if (modalOverlayCompra) this.closeModalCompra(modalOverlayCompra);
    });
    if (cancelarCompraButton) this.renderer.listen(cancelarCompraButton, 'click', () => {
      if (modalOverlayCompra) this.closeModalCompra(modalOverlayCompra);
    });
    if (modalOverlayCompra) this.renderer.listen(modalOverlayCompra, 'click', (event) => {
      if (event.target === modalOverlayCompra) {
        this.closeModalCompra(modalOverlayCompra);
      }
    });

    const lunchUIS = document.getElementById('lunchUIS');
    if (lunchUIS) lunchUIS.addEventListener('click', () => location.reload());
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

  private actualizarReloj(): void {
    const ahora = new Date();
    const segundos = ahora.getSeconds();
    const minutos = ahora.getMinutes();
    const horas = ahora.getHours();

    const segundosGrados = (segundos / 60) * 360;
    const minutosGrados = (minutos / 60) * 360 + (segundos / 60) * 6;
    const horasGrados = (horas / 12) * 360 + (minutos / 60) * 30;

    const segundo = document.getElementById('segundo');
    const minuto = document.getElementById('minuto');
    const hora = document.getElementById('hora');

    if (segundo) segundo.style.transform = `rotate(${segundosGrados}deg)`;
    if (minuto) minuto.style.transform = `rotate(${minutosGrados}deg)`;
    if (hora) hora.style.transform = `rotate(${horasGrados}deg)`;
  }

 private actualizarHoraDigital(): void {
  const ahora = new Date();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');

  // Actualiza la propiedad para usarla en registrarCompra()
  this.horaActual = `${horas}:${minutos}:${segundos}`;

  const horaDigital = document.getElementById('horaDigital');
  if (horaDigital) horaDigital.textContent = this.horaActual;
}


  private showModal(title: string, message: string): void {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modalOverlay) modalOverlay.style.display = 'flex';
  }

  private closeModal(): void {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.style.display = 'none';
  }

  private showModalCompra(modalOverlayCompra: HTMLElement): void {
    modalOverlayCompra.style.display = 'flex';
  }

  private closeModalCompra(modalOverlayCompra: HTMLElement): void {
    modalOverlayCompra.style.display = 'none';
  }
  obtenerUsuarioDeLocalStorage(this: any): void {
    const usuarioString = localStorage.getItem('usuarioRegistrado');
    if (usuarioString) {
      this.user = JSON.parse(usuarioString);
      console.log('Usuario cargado desde localStorage:', this.user);

    } else {
      console.log('No se encontró usuario en localStorage');
    }

  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  registrarCompra(): void {
  const nuevaCompra: Buy = {
    date: this.formatDate(this.currentDate),
    hour: this.horaActual,  // puedes poner la hora actual si quieres con new Date().toLocaleTimeString(), o ponerla fija
    dinner: false,
    lunch: this.isChecked1,
    monthly: false,
    user: { id: this.user.id },  // asegúrate que user tenga el id
    combo: { id: this.comboId }             // id del combo que quieres
  };

  this.buyService.registrarCompra(nuevaCompra).subscribe(response => {
    console.log('Compra registrada:', response);
    this.contador_qr++;

     //Incrementa el comboId para la próxima compra
    this.comboId++;

    // Imprime los valores actuales
    console.log('Nuevo valor de comboId:', this.comboId);
    console.log('Nuevo valor de contador_qr:', this.contador_qr);
    
  }, error => {
    console.error('Error al registrar compra:', error);
  });
}



  onCheckboxChange(event: Event, checkBoxNumber: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkBoxNumber === 1) {
      this.isChecked1 = checkbox.checked;
    }
    else if (checkBoxNumber === 2) {
      this.isChecked2 = checkbox.checked;
    }
    console.log(`Checkbox ${checkBoxNumber} está:`, checkbox.checked);
  }


  //logica para monstrar qr
  obtenerCodigoQR() {
  const base_url = 'http://localhost/api/qrcode/' + this.contador_qr;
  
  this.http.get(base_url, { responseType: 'blob' }).subscribe(
    (respuesta) => {
      console.log('Respuesta:', respuesta);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        console.log('Imagen en Base64:', base64data);
      };
      reader.readAsDataURL(respuesta);
    },
    (error) => {
      console.error('Error al obtener el QR:', error);
    }
  );
}







}
