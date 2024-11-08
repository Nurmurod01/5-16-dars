import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  number: number;

  @Column()
  id: number;

  @Column()
  text: string;

  @Column()
  artist: string;

  @Column()
  title: string;

  @Column()
  url: string;
}
