import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSidenavHarness } from '@angular/material/sidenav/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SignOut } from '../_state/app.actions';
import { AdminComponent } from './admin.component';
import { IMPORTS } from './admin.module.utils';
import { ToggleDrawer } from './_state/admin.actions';
import { AdminState } from './_state/admin.state';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let loader: HarnessLoader;
  let fixture: ComponentFixture<AdminComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        NgxsModule.forRoot([AdminState]),
        ...IMPORTS,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should be logout', () => {
    const signOut = store.dispatch(new SignOut());
    expect(signOut).toBeTruthy();
  });

  it('should have menu button', async () => {
    const menuButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '#menuButton' })
    );
    expect(await menuButton.getText()).toBe('menu');
  });

  it('should have logout button', async () => {
    const logoutButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '#logoutButton' })
    );
    // expect(await logoutButton.get).toBe('logout');
  });

  it('should dispatch an action onMenuButton', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onMenuButton();
    expect(spy).toBeCalledWith(new ToggleDrawer());
  });

  it('should show left drawer by default', async () => {
    const sidenav = await loader.getHarness(MatSidenavHarness);
    expect(await sidenav.isOpen()).toBeTruthy();
  });

  it('should hide left drawer when toggled', async () => {
    component.onMenuButton();
    const sidenav = await loader.getHarness(MatSidenavHarness);
    expect(await sidenav.isOpen()).toBeFalsy();
  });
});
