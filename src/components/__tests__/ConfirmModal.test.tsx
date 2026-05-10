import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ConfirmModal from '../ConfirmModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const defaultProps = {
  isOpen: true,
  title: '削除の確認',
  message: 'このアイテムを削除しますか？',
  onConfirm: vi.fn(),
  onClose: vi.fn(),
};

describe('ConfirmModal', () => {
  it('isOpen=trueのとき、タイトルとメッセージが表示されること', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('削除の確認')).toBeInTheDocument();
    expect(screen.getByText('このアイテムを削除しますか？')).toBeInTheDocument();
  });

  it('isOpen=falseのとき、モーダルが表示されないこと', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('削除の確認')).not.toBeInTheDocument();
  });

  it('削除ボタンをクリックするとonConfirmが呼ばれること', async () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByText('common.deleteButton'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('キャンセルボタンをクリックするとonCloseが呼ばれること', async () => {
    const onClose = vi.fn();
    render(<ConfirmModal {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByText('common.cancelButton'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
