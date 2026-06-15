export type AlgorithmId = string;

export interface AlgorithmOption<T extends AlgorithmId = AlgorithmId> {
  id: T;
  label: string;
  description: string;
}
