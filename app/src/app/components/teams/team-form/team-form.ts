import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  loadTeam,
  createTeam,
  updateTeam,
  clearSelectedTeam,
  clearError,
  addTeamMember,
  removeTeamMember,
} from 'app/store/team/team.actions';
import { clearEmployees, loadEmployees } from 'app/store/employee/employee.actions';
import { selectSelectedTeam, selectTeamLoading } from 'app/store/team/team.selectors';
import { selectEmployees, selectEmployeeLoading } from 'app/store/employee/employee.selectors';
import { TeamDTO } from 'app/store/team/team.state';
import { EmployeeDTO } from 'app/store/employee/employee.state';
import { takeWhile, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-team-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './team-form.html',
  styleUrls: ['./team-form.scss'],
})
export class TeamForm implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  teamForm: FormGroup;
  employeeSearchControl = new FormControl('');
  isEditMode = signal<boolean>(false);
  teamId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  isSearchingEmployees = signal<boolean>(false);
  selectedTeam = signal<TeamDTO | null>(null);
  searchResults = signal<EmployeeDTO[]>([]);
  showSearchResults = signal<boolean>(false);
  private alive = true;

  constructor() {
    this.teamForm = this.createForm();
    this.setupSubscriptions();
    this.setupEmployeeSearch();
  }

  ngOnInit() {
    this.setupRoute();
  }

  ngOnDestroy() {
    this.alive = false;
    this.store.dispatch(clearSelectedTeam());
    this.store.dispatch(clearError());
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    });
  }

  private setupRoute() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.teamId.set(Number(id));
      this.store.dispatch(loadTeam({ id: Number(id) }));
    } else {
      this.isEditMode.set(false);
      this.teamId.set(null);
    }
  }

  private setupSubscriptions() {
    this.store
      .select(selectTeamLoading)
      .pipe(takeWhile(() => this.alive))
      .subscribe((loading) => {
        this.isLoading.set(loading);
      });

    this.store
      .select(selectSelectedTeam)
      .pipe(takeWhile(() => this.alive))
      .subscribe((team) => {
        this.selectedTeam.set(team);
        if (team && this.isEditMode()) {
          this.populateForm(team);
        }
      });

    this.store
      .select(selectEmployees)
      .pipe(takeWhile(() => this.alive))
      .subscribe((employees) => {
        this.searchResults.set(employees);
        this.isSearchingEmployees.set(false);
      });

    this.store
      .select(selectEmployeeLoading)
      .pipe(takeWhile(() => this.alive))
      .subscribe((loading) => {
        this.isSearchingEmployees.set(loading);
      });
  }

  private setupEmployeeSearch() {
    this.employeeSearchControl.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => value !== null && value.length >= 3)
      )
      .subscribe((searchTerm) => {
        if (searchTerm && searchTerm.length >= 3) {
          this.showSearchResults.set(true);
          this.store.dispatch(
            loadEmployees({
              query: {
                q: searchTerm,
                page: 1,
                size: 5,
                isActive: true,
              },
            })
          );
        } else {
          this.showSearchResults.set(false);
          this.searchResults.set([]);
        }
      });
  }

  private populateForm(team: TeamDTO) {
    this.teamForm.patchValue({
      name: team.name,
    });
  }

  onSubmit() {
    if (this.teamForm.valid) {
      const formValue = this.teamForm.value;
      const teamData: TeamDTO = {
        ...formValue,
      };

      if (this.isEditMode() && this.teamId()) {
        this.store.dispatch(
          updateTeam({
            id: this.teamId()!,
            team: { ...teamData, id: this.teamId()! },
          })
        );
      } else {
        this.store.dispatch(createTeam({ team: teamData }));
      }
    }
  }

  onEmployeeSelect(employee: EmployeeDTO) {
    if (this.teamId()) {
      this.store.dispatch(
        addTeamMember({
          teamId: this.teamId()!,
          employeeId: employee.id!,
        })
      );
    }

    this.store.dispatch(clearEmployees());

    this.employeeSearchControl.setValue('');
    this.showSearchResults.set(false);
    this.searchResults.set([]);
  }

  onRemoveEmployee(employeeId: number) {
    if (this.teamId()) {
      this.store.dispatch(
        removeTeamMember({
          teamId: this.teamId()!,
          employeeId: employeeId,
        })
      );
    }
  }

  isEmployeeAlreadyInTeam(employeeId: number): boolean {
    const team = this.selectedTeam();
    return team?.teamMembers?.some((member) => member.employeeId === employeeId) || false;
  }

  getFilteredSearchResults(): EmployeeDTO[] {
    const team = this.selectedTeam();
    const currentMembers = team?.teamMembers?.map((member) => member.employeeId) || [];

    return this.searchResults().filter((employee) => !currentMembers.includes(employee.id!));
  }

  onSearchFocus() {
    if (this.employeeSearchControl.value && this.employeeSearchControl.value.length >= 3) {
      this.showSearchResults.set(true);
    }
  }

  onSearchBlur() {
    setTimeout(() => {
      this.showSearchResults.set(false);
    }, 200);
  }

  goBack() {
    this.router.navigate(['/funcionarios']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.teamForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.teamForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }

    return null;
  }
}
