(BigInt.prototype as any).toJSON = function () {
  return Number.parseInt(this);
};
