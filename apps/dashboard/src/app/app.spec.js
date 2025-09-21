import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { NxWelcome } from './nx-welcome';
describe('App', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            imports: [App, NxWelcome],
        }).compileComponents();
    }));
    it('should render title', () => {
        var _a;
        const fixture = TestBed.createComponent(App);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect((_a = compiled.querySelector('h1')) === null || _a === void 0 ? void 0 : _a.textContent).toContain('Welcome dashboard');
    });
});
//# sourceMappingURL=app.spec.js.map