import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from '../../_model/proveedor';
import { MatAutocompleteModule, MatSnackBar } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProveedorService } from '../../_service/proveedor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  lista: Proveedor[] = [];
  displayedColumns = ['id', 'nombre', 'correo', 'telefono'];
  dataSource: MatTableDataSource<Proveedor>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;
  
  constructor(private prv: ProveedorService, private snackBar: MatSnackBar, public route: ActivatedRoute) {}


  ngOnInit() {
    this.prv.getListarProveedor(0,5).subscribe(data => {
      /* console.log(data);
      this.lista = data;
      console.log(this.lista); */
      console.log(data);
      let proveedor = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(proveedor);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.prv.proveedorCambio.subscribe(data => {
      let proveedor = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(proveedor);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.prv.mensaje.subscribe( data => {
      this.snackBar.open(data, null, {duration: 2000});
    });


    /* setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.lista);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000); */
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  mostrarMas(e){
    this.prv.getListarProveedor(e.pageIndex, e.pageSize).subscribe(data =>{
      let proveedor = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;
      this.dataSource = new MatTableDataSource(proveedor);

      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    });
  }

  eliminar(proveedor: Proveedor): void {
    console.log(proveedor);
    this.prv.eliminar(proveedor).subscribe(data => {
      if (data === 1) {
        this.prv.getListarProveedor(0, 10).subscribe(equipos => {
          this.prv.proveedorCambio.next(equipos);
          this.prv.mensaje.next("Se elimino correctamente");
        });
      } else {
        this.prv.mensaje.next("No se pudo eliminar");
      }
    });
  }

}
