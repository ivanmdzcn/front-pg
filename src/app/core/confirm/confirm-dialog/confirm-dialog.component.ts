import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmOptions, ConfirmService } from '../confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnDestroy {
  open = false;
  opts: Required<ConfirmOptions> = {
    title: 'Confirmación',
    message: '¿Deseas continuar?',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    danger: false
  };

  private _resolve?: (v: boolean) => void;
  private sub: Subscription;

  constructor(private confirmSrv: ConfirmService) {
    this.sub = this.confirmSrv.requests$.subscribe(req => {
      this.opts = { ...this.opts, ...(req.options || {}) };
      this._resolve = req.resolve;
      this.open = true;
    });
  }

  handle(value: boolean) {
    this.open = false;
    this._resolve?.(value);
    this._resolve = undefined;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
