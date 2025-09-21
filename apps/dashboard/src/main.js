import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app';
import { authInterceptor } from './app/core/auth.interceptor';
bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideRouter(routes),
    ],
}).catch(err => console.error(err));
//# sourceMappingURL=main.js.map