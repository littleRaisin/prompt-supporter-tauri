import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type * as ReactRouterDom from 'react-router-dom';
import Edit from '../Edit';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, opts?: Record<string, unknown>) => {
    if (opts?.name) return `${key}:${opts.name}`;
    return key;
  }}),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../db/repository', () => ({
  getTranslation: vi.fn(),
  upsertTranslation: vi.fn(),
  deleteTranslation: vi.fn(),
}));

// react-router-dom の useNavigate をモック
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouterDom>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { getTranslation, upsertTranslation, deleteTranslation } from '../../db/repository';
import type { Mock } from 'vitest';

const mockTranslation = {
  prompt_name: 'test-prompt',
  translation_text: 'テスト翻訳',
  search_word: 'search',
  note: 'メモ',
  favorite: 1 as const,
  copyrights: '著作権',
  category: 'character' as const,
};

beforeEach(() => {
  vi.clearAllMocks();
  (getTranslation as Mock).mockResolvedValue(mockTranslation);
  (upsertTranslation as Mock).mockResolvedValue(undefined);
  (deleteTranslation as Mock).mockResolvedValue(undefined);
});

const renderNew = () =>
  render(
    <MemoryRouter initialEntries={['/edit']}>
      <Routes>
        <Route path="/edit" element={<Edit />} />
      </Routes>
    </MemoryRouter>
  );

const renderEdit = (promptName = 'test-prompt') =>
  render(
    <MemoryRouter initialEntries={[`/edit/${promptName}`]}>
      <Routes>
        <Route path="/edit/:promptName" element={<Edit />} />
      </Routes>
    </MemoryRouter>
  );

describe('Edit - 新規登録モード', () => {
  it('新規登録のタイトルが表示されること', () => {
    renderNew();
    expect(screen.getByText('common.New Registration')).toBeInTheDocument();
  });

  it('promptNameが空のままサブミットするとバリデーションエラーが表示されること', async () => {
    renderNew();
    await userEvent.click(screen.getByText('common.saveButton'));
    expect(await screen.findByText('common.promptNameRequired')).toBeInTheDocument();
  });

  it('フォームに入力してサブミットするとupsertTranslationが呼ばれること', async () => {
    renderNew();
    await userEvent.type(screen.getByPlaceholderText('common.enterNewPromptName'), 'new-prompt');
    await userEvent.click(screen.getByText('common.saveButton'));
    await waitFor(() => {
      expect(upsertTranslation).toHaveBeenCalledWith(
        expect.objectContaining({ promptName: 'new-prompt' })
      );
    });
  });

  it('サブミット後に検索ページへナビゲートされること', async () => {
    renderNew();
    await userEvent.type(screen.getByPlaceholderText('common.enterNewPromptName'), 'new-prompt');
    await userEvent.click(screen.getByText('common.saveButton'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search/new-prompt');
    });
  });

  it('キャンセルボタンをクリックすると戻るナビゲートが呼ばれること', async () => {
    renderNew();
    await userEvent.click(screen.getByText('common.cancelButton'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('tagカテゴリ選択時にcopyrightsフィールドが非表示になること', async () => {
    renderNew();
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'tag');
    expect(screen.queryByLabelText('common.Copyrights')).not.toBeInTheDocument();
  });
});

describe('Edit - 編集モード', () => {
  it('編集のタイトルが表示されること', async () => {
    renderEdit();
    expect(await screen.findByText('common.Edit')).toBeInTheDocument();
  });

  it('既存データがフォームにロードされること', async () => {
    renderEdit();
    const input = await screen.findByDisplayValue('テスト翻訳');
    expect(input).toBeInTheDocument();
  });

  it('promptNameフィールドが編集不可であること', async () => {
    renderEdit();
    await screen.findByText('common.Edit');
    const promptInput = screen.getByPlaceholderText('common.enterNewPromptName');
    expect(promptInput).toBeDisabled();
  });

  it('削除ボタンが表示されること', async () => {
    renderEdit();
    expect(await screen.findByText('common.deleteButton')).toBeInTheDocument();
  });

  it('削除ボタンをクリックすると確認モーダルが開くこと', async () => {
    renderEdit();
    await screen.findByText('common.deleteButton');
    await userEvent.click(screen.getByText('common.deleteButton'));
    expect(screen.getByText('common.deleteConfirmTitle')).toBeInTheDocument();
  });

  it('確認モーダルで削除を確定するとdeleteTranslationが呼ばれること', async () => {
    renderEdit();
    await screen.findByText('common.deleteButton');
    await userEvent.click(screen.getByText('common.deleteButton'));
    // モーダルが開いたら、ダイアログ内の削除ボタンをクリック
    const dialog = screen.getByRole('dialog');
    await userEvent.click(within(dialog).getByText('common.deleteButton'));
    await waitFor(() => {
      expect(deleteTranslation).toHaveBeenCalledWith('test-prompt');
    });
  });

  it('コピーして新規登録ボタンが表示されること', async () => {
    renderEdit();
    expect(await screen.findByText('common.copyAndNewRegistration')).toBeInTheDocument();
  });
});
