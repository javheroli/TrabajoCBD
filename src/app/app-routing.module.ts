import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule' },
  {
    path: 'userForm',
    loadChildren: './pages/register/register.module#RegisterPageModule'
  },
  {
    path: 'users',
    loadChildren: './pages/users/users.module#UsersPageModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'chat',
    children: [
      {
        path: ':loggedUsername',
        children: [
          {
            path: ':otherUsername',
            loadChildren: './pages/chat/chat.module#ChatPageModule',
            canLoad: [AuthGuard]
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
