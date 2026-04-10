export class Scale {
  constructor(private scaleFactor: number) {}

  val(value: number): number {
    return this.scaleFactor * value;
  }
}

