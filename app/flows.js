export function dropdown() {
  return this.orientBelow.andSnapTo(this.center, this.rightEdge, this.leftEdge)
   .then(this.orientAbove.andSnapTo(this.center, this.rightEdge, this.leftEdge));
}
