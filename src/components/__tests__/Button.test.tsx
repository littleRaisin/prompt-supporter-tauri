import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('ボタンのテキストが正しく表示されること', () => {
    render(<Button text="テストボタン" />);
    expect(screen.getByText('テストボタン')).toBeInTheDocument();
  });

  it('クリックハンドラが正しく呼び出されること', async () => {
    const handleClick = vi.fn();
    render(<Button text="クリックミー" onClick={handleClick} />);
    await userEvent.click(screen.getByText('クリックミー'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('デフォルトのtypeがbuttonであること', () => {
    render(<Button text="デフォルトタイプ" />);
    expect(screen.getByText('デフォルトタイプ')).toHaveAttribute('type', 'button');
  });

  it('指定されたtypeが正しく適用されること', () => {
    render(<Button text="サブミット" type="submit" />);
    expect(screen.getByText('サブミット')).toHaveAttribute('type', 'submit');
  });

  it('disabledがtrueの場合、ボタンがクリックできないこと', async () => {
    const handleClick = vi.fn();
    render(<Button text="無効ボタン" onClick={handleClick} disabled />);
    await userEvent.click(screen.getByText('無効ボタン'));
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByText('無効ボタン')).toBeDisabled();
  });

  it('danger variantで赤背景のスタイルが適用されること', () => {
    render(<Button text="削除" variant="danger" />);
    expect(screen.getByText('削除').className).toContain('bg-red-500');
  });

  it('secondary variantでグレー背景のスタイルが適用されること', () => {
    render(<Button text="キャンセル" variant="secondary" />);
    expect(screen.getByText('キャンセル').className).toContain('bg-gray-300');
  });
});
