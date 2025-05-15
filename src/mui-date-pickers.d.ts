import { TextFieldProps } from '@mui/material/TextField';
import { FormikErrors } from 'formik';

// Adiciona suporte para 'outlined' como valor válido para a propriedade variant
declare module '@mui/material/TextField' {
  interface TextFieldProps {
    variant?: 'standard' | 'filled' | 'outlined';
    helperText?: React.ReactNode | FormikErrors<any> | string | undefined;
  }
}

// Adiciona suporte para o tipo FormikErrors<Date> como ReactNode
declare module 'react' {
  interface ReactNode {
    toString(): string;
  }
}
