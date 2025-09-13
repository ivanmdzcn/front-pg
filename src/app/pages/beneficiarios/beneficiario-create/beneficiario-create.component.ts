import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BeneficiarioService, BeneficiarioCreate } from '../../../services/beneficiario.service';
import { CausanteService, CausanteItem } from '../../../services/causante.service';


@Component({
  selector: 'app-beneficiario-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './beneficiario-create.component.html',
  styleUrls: ['./beneficiario-create.component.css']
})
export class BeneficiarioCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private benefSrv = inject(BeneficiarioService);
  private causSrv = inject(CausanteService);

  // catálogo de causantes (puedes paginar/buscar más adelante)
  causantes: CausanteItem[] = [];
  cargandoCausantes = false;

  // valores por defecto
  causanteIdParam = 0;

  // UI state
  saving = false;
  error: string | null = null;

  form = this.fb.group({
    bencau: [0, [Validators.required]],
    bencod: [null as number | null, [Validators.required, Validators.min(1)]],
    benno1: ['', [Validators.required, Validators.maxLength(100)]],
    benno2: [''],
    benap1: ['', [Validators.required, Validators.maxLength(100)]],
    benap2: [''],
    benres: ['', [Validators.required, Validators.maxLength(20)]],
    bendpi: ['', [
      Validators.required,
      Validators.pattern(/^\d{13}$/)   // 13 dígitos
    ]],
    benpar: ['', [Validators.required]],     // '1','2',...
    benmon: [null as number | null, [Validators.required, Validators.min(0)]],
    bensit: [''],                            // '', 'V', 'T'
    bentrm: [null as number | null],         // required if bensit == 'T'
    benate: [null as number | null],         // required if bensit == 'T'
  });

  ngOnInit(): void {
    this.causanteIdParam = Number(this.route.snapshot.paramMap.get('causanteId')) || 0;

    // precargar causantes (simple: traer todos y mapear)
    this.cargarCausantes();

    // precargar el causante del parámetro si viene
    if (this.causanteIdParam > 0) {
      this.form.patchValue({ bencau: this.causanteIdParam });
    }

    // validación condicional: si bensit == 'T', obligar bentrm y benate
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

  private cargarCausantes(): void {
    this.cargandoCausantes = true;
    this.causSrv.listar('').subscribe({
      next: res => {
        // tu listar() devuelve CausanteItem[]
        this.causantes = res;
        this.cargandoCausantes = false;
      },
      error: err => {
        console.error(err);
        this.cargandoCausantes = false;
      }
    });
  }

  // catálogos simples (puedes migrarlos a API cuando quieras)
  get parentescos() { return [{ value: '1', label: 'Esposa' }, { value: '2', label: 'Compañera de hecho' }]; }
  get situaciones()  { return [{ value: '', label: '—' }, { value: 'V', label: 'Vigente' }, { value: 'T', label: 'Terminado' }]; }
  get terminaciones(){ return [{ value: 1, label: 'Mayoridad' }, { value: 2, label: 'Fallecimiento' }]; }

  submit(): void {
    this.error = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const v = this.form.value;

    // normalizar a lo que espera la API (null en lugar de '' y números)
    const dto: BeneficiarioCreate = {
      bencau: Number(v.bencau),
      bencod: Number(v.bencod),
      benno1: (v.benno1 || '').toString().trim(),
      benno2: (v.benno2 || '')?.toString().trim() || null,
      benap1: (v.benap1 || '').toString().trim(),
      benap2: (v.benap2 || '')?.toString().trim() || null,
      benres: (v.benres || '').toString().trim(),
      bendpi: (v.bendpi || '').toString().trim(),
      benpar: (v.benpar || '').toString().trim(),
      benmon: Number(v.benmon),
      bensit: (v.bensit || '').toString().trim() || null,
      bentrm: v.bentrm != null ? Number(v.bentrm) : null,
      benate: v.benate != null ? Number(v.benate) : null,
      benudg: localStorage.getItem('usuario') || 'appuser'
    };

    // si bensit != 'T', forzar nulos:
    if (dto.bensit !== 'T') { dto.bentrm = null; dto.benate = null; }

    this.benefSrv.crear(dto).subscribe({
      next: () => {
        this.saving = false;
        // volver al detalle del causante elegido
        this.router.navigate(['/beneficiarios', dto.bencau]);
      },
      error: (err) => {
        this.saving = false;
        console.error(err);
        // manejo de duplicados (PK compuesta o UNIQUE DPI por causante)
        if (err.status === 409 || (err.error?.mensaje && /duplicado|duplicate|única/i.test(err.error.mensaje))) {
          this.error = 'Ya existe un beneficiario con ese código o DPI para este causante.';
        } else if (err.status === 400) {
          this.error = err.error?.mensaje || 'Datos inválidos.';
        } else {
          this.error = 'Ocurrió un error al crear el beneficiario.';
        }
      }
    });
  }
}
