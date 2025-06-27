export class ListNode<T> {
  constructor(
    public val: T,
    public prev: ListNode<T> | null = null,
    public next: ListNode<T> | null = null,
  ) {}
}
