# Prompt Supporter (Tauri 版)

React + TypeScript + Tauri 2.x によるデスクトップアプリです。

## 開発環境のセットアップ

### 前提条件

- Node.js 18+
- Rust (rustup 経由でインストール)
- Tauri CLI: `cargo install tauri-cli`

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run tauri dev
```

### ビルド

```bash
npm run tauri build
```

### テスト実行

```bash
npm test
```

### カバレッジ計測

```bash
npm run coverage
```

---

## Electron 版からのデータ移行

Electron 版 (`prompt-supporter`) から Tauri 版へ SQLite データを移行する手順です。

### 1. Electron 版の DB ファイルを確認する

Electron 版のデータは以下のパスに保存されています:

| OS      | パス                                                                             |
|---------|--------------------------------------------------------------------------------|
| Windows | `%APPDATA%\prompt-supporter\prompt-supporter.sqlite`                           |
| macOS   | `~/Library/Application Support/prompt-supporter/prompt-supporter.sqlite`      |
| Linux   | `~/.config/prompt-supporter/prompt-supporter.sqlite`                          |

### 2. Tauri 版の DB 保存先を確認する

Tauri 版のデータは以下のパスに保存されます:

| OS      | パス                                                                                              |
|---------|--------------------------------------------------------------------------------------------------|
| Windows | `%APPDATA%\com.littleraisin.prompt-supporter\prompt_supporter.db`                               |
| macOS   | `~/Library/Application Support/com.littleraisin.prompt-supporter/prompt_supporter.db`          |
| Linux   | `~/.local/share/com.littleraisin.prompt-supporter/prompt_supporter.db`                         |

> **注意:** Tauri 版を一度も起動していない場合、保存先ディレクトリが存在しない場合があります。  
> 先に Tauri 版アプリを起動して DB を初期化してからコピーしてください。

### 3. DB ファイルをコピーする

#### Windows (PowerShell)

```powershell
# Tauri 版アプリを起動して DB を初期化した後、アプリを終了してから実行
$src  = "$env:APPDATA\prompt-supporter\prompt-supporter.sqlite"
$dest = "$env:APPDATA\com.littleraisin.prompt-supporter\prompt_supporter.db"

Copy-Item $src $dest -Force
```

#### macOS / Linux

```bash
# Tauri 版アプリを起動して DB を初期化した後、アプリを終了してから実行
# macOS
SRC=~/Library/Application\ Support/prompt-supporter/prompt-supporter.sqlite
DEST=~/Library/Application\ Support/com.littleraisin.prompt-supporter/prompt_supporter.db

cp "$SRC" "$DEST"
```

### 4. スキーマの互換性について

Electron 版と Tauri 版は同じ SQLite スキーマを使用しています。  
Tauri 版はアプリ起動時にマイグレーションを実行しますが、既存テーブルは `CREATE TABLE IF NOT EXISTS` で作成されるため上書きされません。

ただし、Tauri 版で新たに追加されたカラム（`category` など）が Electron 版の DB に存在しない場合は、  
Tauri 版のマイグレーション (`v2`) が自動で `ALTER TABLE` を実行して追加します。

---

## 推奨 IDE

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
