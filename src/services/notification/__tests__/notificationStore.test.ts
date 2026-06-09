import { notificationStore } from '../store';

beforeEach(() => {
  const all = notificationStore.getSnapshot();
  all.forEach((n) => notificationStore.remove(n.id));
});

describe('notificationStore', () => {
  test('adds a notification item', () => {
    notificationStore.add({ text: 'Test' });

    const items = notificationStore.getSnapshot();

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ text: 'Test', id: expect.any(Number) });
  });

  test('increments id for each item', () => {
    notificationStore.add({ text: 'A' });
    notificationStore.add({ text: 'B' });

    const [item1, item2] = notificationStore.getSnapshot();

    expect(item2.id).toBeGreaterThan(item1.id);
  });

  test('removes an item by id', () => {
    notificationStore.add({ text: 'A' });
    notificationStore.add({ text: 'B' });
    const [, second] = notificationStore.getSnapshot();

    notificationStore.remove(second.id);

    const items = notificationStore.getSnapshot();

    expect(items).toHaveLength(1);
    expect(items[0].text).toBe('A');
  });

  test('notifies listener on add', () => {
    const listener = vi.fn();
    notificationStore.subscribe(listener);

    notificationStore.add({ text: 'Test' });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('notifies listener on remove', () => {
    const listener = vi.fn();
    notificationStore.subscribe(listener);
    notificationStore.add({ text: 'Test' });
    listener.mockClear();

    const [item] = notificationStore.getSnapshot();
    notificationStore.remove(item.id);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('stops notifications after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = notificationStore.subscribe(listener);
    unsubscribe();

    notificationStore.add({ text: 'Test' });

    expect(listener).not.toHaveBeenCalled();
  });

  test('returns a copy of the list from getSnapshot', () => {
    notificationStore.add({ text: 'A' });
    const snapshot1 = notificationStore.getSnapshot();
    notificationStore.add({ text: 'B' });
    const snapshot2 = notificationStore.getSnapshot();

    expect(snapshot1).toHaveLength(1);
    expect(snapshot2).toHaveLength(2);
  });
});
