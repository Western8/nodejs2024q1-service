(BigInt.prototype as any).toJSON = function() {
    //return this.toString()
    return Number.parseInt(this)
} 