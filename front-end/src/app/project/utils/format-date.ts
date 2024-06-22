
import { NativeDateAdapter } from '@angular/material/core';

// Create a custom date adapter to format the date
export class CustomDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      return date.toDateString();
    }
  }
  
  // Define the custom date formats
  export const MY_DATE_FORMATS = {
    parse: {
      dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' },
    },
    display: {
      dateInput: 'input',
      monthYearLabel: { year: 'numeric', month: 'short' },
      dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
      monthYearA11yLabel: { year: 'numeric', month: 'long' },
    },
  };