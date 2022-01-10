export const constrainValue = ({ value, maxValue, defaultValue = 1 }) => {
  return (value ? (value < maxValue ? value : maxValue) : defaultValue)
}

export class ValueScaler {
    a;
    b;
    constructor (low, high) {
      this.low = low
      this.high = high
    }

    fit (vals) {
      const valmin = Math.min(...vals)
      const valmax = Math.max(...vals)
      if (valmax === valmin) {
        this.a = 0.0
      } else {
        this.a = (this.high - this.low) / (valmax - valmin)
      }
      this.b = this.low - valmin * this.a
    }

    transform (vals) {
      return vals.map(x => { return x * this.a + this.b })
    }

    fitTransform (vals) {
      this.fit(vals)
      return this.transform(vals)
    }
}

export class ColorScaler extends ValueScaler {
    col1;
    col2;
    constructor (low, high) {
      super(0.0, 1.0)
      this.col1 = low
      this.col2 = high
    }

    // super.fit(vals)

    _process (s0, s1, r) {
      const x0 = parseInt(s0)
      const x1 = parseInt(s1)
      if (isNaN(x0) || isNaN(x1)) return s0
      return Math.floor(x0 + (x1 - x0) * r)
    }

    transform (vals) {
      const s1 = this.col1.split(/(\d+)/)
      const s2 = this.col2.split(/(\d+)/)
      const _vals01 = vals.map(x => { return x * this.a + this.b })

      return _vals01.map(v => s1.map((s, i) => this._process(s, s2[i], v)).join(''))
    }
}
