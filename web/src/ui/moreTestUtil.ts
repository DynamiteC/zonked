import { fireEvent, screen } from '@testing-library/react';

/** Opens the More menu if needed, then clicks the item with this test id. */
export function clickMore(testId: string): void {
  if (screen.queryByTestId(testId) === null) fireEvent.click(screen.getByTestId('more-toggle'));
  fireEvent.click(screen.getByTestId(testId));
}
