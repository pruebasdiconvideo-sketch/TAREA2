import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AdminPedidos } from './admin-pedidos';

describe('AdminPedidos', () => {
  let component: AdminPedidos;
  let fixture: ComponentFixture<AdminPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPedidos],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
