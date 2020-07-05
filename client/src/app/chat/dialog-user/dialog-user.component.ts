/**
 * X-Chat Client.
 * Dialog User component
 * @author Serhiy Posokhin
 * @version 1.0.0
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {
  nicknameFormControl = new FormControl('', [Validators.required]);
  previousUsername: string;

  constructor(public dialogRef: MatDialogRef<DialogUserComponent>,
              @Inject(MAT_DIALOG_DATA) public params: any,
  ) {
    this.previousUsername = params.nickname ? params.nickname : undefined;
    this.nicknameFormControl.setValue(params.nickname);
  }

  ngOnInit() {
  }

  public onSave(): void {
    this.dialogRef.close({
      nickname: this.nicknameFormControl.value,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername
    });
  }
}
