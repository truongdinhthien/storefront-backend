export interface IModel<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
  update(id: number): Promise<T>;
}
