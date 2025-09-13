import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  BeneficiarioService,
  BeneficiarioEdit
} from '../../../services/beneficiario.service';
import { CausanteService, CausanteItem } from '../../../services/causante.service';

@Component({
  selector: 'app-beneficiario-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './beneficiario-edit.component.html',
  styleUrls: ['./beneficiario-edit.component.css']
})
export class BeneficiarioEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private benefSrv = inject(BeneficiarioService);
  private causSrv = inject(CausanteService);

  bencau = 0;
  bencod = 0;

  // catálogo para selects
  causantes: CausanteItem[] = [];

  loading = false;
  saving = false;
  error: string | null = null;

  form = this.fb.group({
    bencau: [{ value: 0, disabled: true }, [Validators.required]], // no editable
    bencod: [{ value: 0, disabled: true }, [Validators.required]], // no editable
    benno1: ['', [Validators.required, Validators.maxLength(100)]],
    benno2: [''],
    benap1: ['', [Validators.required, Validators.maxLength(100)]],
    benap2: [''],
    benres: ['', [Validators.required, Validators.maxLength(20)]],
    bendpi: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    benpar: ['', [Validators.required]], // '1','2',...
    benmon: [null as number | null, [Validators.required, Validators.min(0)]],
    bensit: [''],
    bentrm: [null as number | null],
    benate: [null as number | null],
  });

  ngOnInit(): void {
    this.bencau = Number(this.route.snapshot.paramMap.get('causanteId')) || 0;
    this.bencod = Number(this.route.snapshot.paramMap.get('bencod')) || 0;

    this.cargarCausantes(); // por si quieres mostrar el nombre del causante en header
    this.cargar();
    this.configurarValidacionesCondicionales();
  }

  private cargarCausantes(): void {
    this.causSrv.listar('').subscribe({
      next: res => (this.causantes = res),
      error: () => {}
    });
  }

  private cargar(): void {
    this.loading = true;
    this.error = null;

    this.benefSrv.obtenerUno(this.bencau, this.bencod).subscribe({
      next: (b: BeneficiarioEdit) => {
        this.form.reset({
          bencau: b.bencau,
          bencod: b.bencod,
          benno1: b.benno1,
          benno2: b.benno2 || '',
          benap1: b.benap1,
          benap2: b.benap2 || '',
          benres: b.benres,
          bendpi: b.bendpi,
          benpar: b.benpar,
          benmon: b.benmon,
          bensit: b.bensit || '',
          bentrm: b.bentrm ?? null,
          benate: b.benate ?? null
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el beneficiario.';
        this.loading = false;
      }
    });
  }

  private configurarValidacionesCondicionales(): void {
    this.form.get('bensit')!.valueChanges.subscribe(v => {
      const isTerminado = (v || '').toString().trim().toUpperCase() === 'T';
      const bentrm = this.form.get('bentrm')!;
      const benate = this.form.get('benate')!;
      if (isTerminado) {
        bentrm.addValidators([Validators.required, Validators.min(1)]);
        benate.addValidators([Validators.required, Validators.min(1)]);
      } else {
        bentrm.clearValidators();
        benate.clearValidators();
        this.form.patchValue({ bentrm: null, benate: null }, { emitEvent: false });
      }
      bentrm.updateValueAndValidity({ emitEvent: false });
      benate.updateValueAndValidity({ emitEvent: false });
    });
  }

  get parentescos() { return [{ value: '1', label: 'Esposa' }, { value: '2', label: 'Compañera de hecho' }]; }
  get situaciones()  { return [{ value: '', label: '—' }, { value: 'V', label: 'Vigente' }, { value: 'T', label: 'Terminado' }]; }
  get terminaciones(){ return [{ value: 1, label: 'Mayoridad' }, { value: 2, label: 'Fallecimiento' }]; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;
    this.error = null;

    const raw = this.form.getRawValue(); // incluye deshabilitados
    const dto: BeneficiarioEdit = {
      bencau: Number(raw.bencau),
      bencod: Number(raw.bencod),
      benno1: (raw.benno1 || '').toString().trim(),
      benno2: (raw.benno2 || '')?.toString().trim() || null,
      benap1: (raw.benap1 || '').toString().trim(),
      benap2: (raw.benap2 || '')?.toString().trim() || null,
      benres: (raw.benres || '').toString().trim(),
      bendpi: (raw.bendpi || '').toString().trim(),
      benpar: (raw.benpar || '').toString().trim(),
      benmon: Number(raw.benmon),
      bensit: (raw.bensit || '').toString().trim() || null,
      bentrm: raw.bentrm != null ? Number(raw.bentrm) : null,
      benate: raw.benate != null ? Number(raw.benate) : null,
      benudg: localStorage.getItem('usuario') || 'appuser'
    };

    if (dto.bensit !== 'T') { dto.bentrm = null; dto.benate = null; }

    this.benefSrv.actualizar(dto).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/beneficiarios', dto.bencau]);
      },
      error: (err) => {
        this.saving = false;
        console.error(err);
        if (err.status === 409) {
          this.error = 'DPI duplicado para este causante.';
        } else {
          this.error = err.error?.mensaje || 'No se pudo actualizar.';
        }
      }
    });
  }
}
