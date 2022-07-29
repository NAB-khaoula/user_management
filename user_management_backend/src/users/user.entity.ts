import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  avatarUrl: string;

  @Column()
  removedAvatar: boolean;

  @Column()
  twoFactorAuth: boolean;
}
