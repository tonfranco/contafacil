/// <reference types="react-scripts" />

// Sobrescrever os tipos do Material UI para compatibilidade com versões mais antigas
declare namespace React {
  interface HTMLAttributes<T> {
    item?: boolean;
    container?: boolean;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    button?: boolean;
  }
}
