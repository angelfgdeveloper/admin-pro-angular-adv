import { Component, OnInit } from '@angular/core';

import { Usuario } from '../../models/usuario.model';

import { UsuarioService } from 'src/app/services/usuario.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public usuario!: Usuario;
  // public menuItems: any[] = [];

  constructor(
    public sidebarService: SidebarService,
    private usuarioServices: UsuarioService
  ) {
    // this.menuItems = sidebarService.menu;
    this.usuario = usuarioServices.usuario;
    //console.warn(this.menuItems);
  }

  ngOnInit(): void {
  }

}
