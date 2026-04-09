export class Scale {
  constructor(private scaleFactor: number) {}

  val(value: number): number {
    return this.scaleFactor * value;
  }

  og(value: number): number {
    return value / this.scaleFactor;
  }

  getScaleFactor(): number {
    return this.scaleFactor;
  }
}

