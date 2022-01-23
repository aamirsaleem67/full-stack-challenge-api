import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { utc } from 'moment';
import { Document } from 'mongoose';
import { IBooker } from '../interfaces/booker.interface';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({
    type: Object,
  })
  booker: IBooker;

  @Prop({
    type: Date,
  })
  arrival: Date;

  @Prop({
    type: Date,
  })
  departure: Date;

  @Prop({
    type: Number,
  })
  adults: number;

  @Prop({
    type: Date,
    default: utc().toDate(),
  })
  createdAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
