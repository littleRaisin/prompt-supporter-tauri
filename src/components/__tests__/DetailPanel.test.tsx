import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type * as ReactRouterDom from 'react-router-dom';
import DetailPanel from '../DetailPanel';
import type { Translation } from '../../types/Translation';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../db/repository', () => ({
  upsertTranslation: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouterDom>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import { upsertTranslation } from '../../db/repository';
import { toast } from 'react-hot-toast';
import type { Mock } from 'vitest';

const mockItem: Translation = {
  prompt_name: 'test-prompt',
  translation_text: 'テスト翻訳',
  search_word: 'search',
  note: 'メモ内容',
  favorite: 0,
  copyrights: '著作権テキスト',
  category: 'character',
};

const renderPanel = (item: Translation | null = mockItem) =>
  render(
    <MemoryRouter>
      <DetailPanel item={item} onDataChange={vi.fn()} />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
  (upsertTranslation as Mock).mockResolvedValue(undefined);

  // clipboard API のモック
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});

describe('DetailPanel', () => {
  it('item が null のとき何も表示されないこと', () => {
    const { container } = renderPanel(null);
    expect(container.firstChild).toBeNull();
  });

  it('翻訳テキストが表示されること', () => {
    renderPanel();
    expect(screen.getByText('テスト翻訳')).toBeInTheDocument();
  });

  it('メモが表示されること', () => {
    renderPanel();
    expect(screen.getByText('メモ内容')).toBeInTheDocument();
  });

  it('著作権テキストが表示されること', () => {
    renderPanel();
    expect(screen.getAllByText('著作権テキスト').length).toBeGreaterThan(0);
  });

  it('category が tag のとき著作権フィールドが表示されないこと', () => {
    renderPanel({ ...mockItem, category: 'tag' });
    expect(screen.queryByText('著作権テキスト')).not.toBeInTheDocument();
  });

  it('コピーボタンをクリックするとクリップボードに書き込まれること', async () => {
    renderPanel();
    const [firstCopyButton] = screen.getAllByLabelText('common.copyButton');
    await userEvent.click(firstCopyButton!);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('コピー成功時に toast.success が呼ばれること', async () => {
    renderPanel();
    const [firstCopyButton] = screen.getAllByLabelText('common.copyButton');
    await userEvent.click(firstCopyButton!);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('common.copiedMessage');
    });
  });

  it('編集ボタンをクリックすると編集ページへナビゲートされること', async () => {
    renderPanel();
    await userEvent.click(screen.getByText('common.Edit'));
    expect(mockNavigate).toHaveBeenCalledWith('/edit/test-prompt');
  });

  it('お気に入りトグルをクリックすると upsertTranslation が呼ばれること', async () => {
    renderPanel();
    await userEvent.click(screen.getByTitle('common.Add to favorites'));
    await waitFor(() => {
      expect(upsertTranslation).toHaveBeenCalledWith(
        expect.objectContaining({ promptName: 'test-prompt', favorite: 1 })
      );
    });
  });

  it('お気に入り登録成功時に toast.success が呼ばれること', async () => {
    renderPanel();
    await userEvent.click(screen.getByTitle('common.Add to favorites'));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('common.addedToFavoritesMessage');
    });
  });
});
