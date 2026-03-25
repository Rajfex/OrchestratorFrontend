import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { RegisterForm } from './register-form/register-form';
import { RobotsPanel } from './robots-panel/robots-panel';
import { AuthService } from './auth.service';
import { AddTask } from './add-task/add-task';
import { Tasks } from './tasks/tasks';
import { TaskDetails } from './task-details/task-details';
import { LogsList } from './logs-list/logs-list';

const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated() ? true : router.createUrlTree(['/']);
};

export const routes: Routes = [
    { path: 'register', component: RegisterForm },
    { path: 'robots', component: RobotsPanel, canActivate: [authGuard] },
    { path: 'addTask', component: AddTask, canActivate: [authGuard] },
    { path: 'tasks', component: Tasks, canActivate: [authGuard] },
    { path: 'tasks/:id', component: TaskDetails, canActivate: [authGuard] },
    { path: 'logs/:page', component: LogsList, canActivate: [authGuard] },
];
