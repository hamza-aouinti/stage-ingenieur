import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit(): void {
    const formValue = this.form.value
    if(this.form.invalid){
      return;
    }
    this.authenticationService.login(formValue.email, formValue.password,)


  }
}
