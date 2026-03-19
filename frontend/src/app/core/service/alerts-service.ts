import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
 
  // Color temático para tu tienda de muñecas
  private primaryColor = '#E8A598'; 

  success(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: this.primaryColor,
      heightAuto: false
    });
  }

  error(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#8B3A36',
      heightAuto: false
    });
  }

  warning(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#f8bb86',
      heightAuto: false
    });
  }

  // para cuando el backend está procesando el correo
  loading(title: string = 'Procesando...') {
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }
}

