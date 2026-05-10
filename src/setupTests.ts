import '@testing-library/jest-dom';

// Tauri IPC は jsdom では動作しないためグローバルモックを設定
// 各テストで vi.mock('./db/repository') を使用して個別にモックする
