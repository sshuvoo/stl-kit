export class ListNode<T> {
  constructor(
    public val: T,
    public prev: ListNode<T> | null = null,
    public next: ListNode<T> | null = null,
  ) {}
  public cleanup() {
    this.prev = null
    this.next = null
    this.val = null as T
  }
}
