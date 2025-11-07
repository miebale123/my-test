import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  // User entity definition
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}
