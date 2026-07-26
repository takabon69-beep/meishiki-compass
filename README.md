# MEISHIKI Compass

命式から、自己理解と他者との関係性を読み解くプロトタイプWebアプリです。

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Access Code

公開時に簡易パスコード画面を有効にする場合は、パスコードそのものではなくSHA-256ハッシュを `VITE_ACCESS_CODE_HASH` として渡します。

ハッシュ作成例:

```bash
node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('ここにパスコード')).then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))"
```

GitHub Pagesで使う場合は、GitHubリポジトリの `Settings > Secrets and variables > Actions` に `VITE_ACCESS_CODE_HASH` を追加してください。

注意: GitHub Pagesは静的サイトのため、これはプロトタイプ向けの簡易ロックです。本格的に守りたい場合は、Cloudflare Access、Netlify/Vercelの認証、または会員ログイン付きの構成を使ってください。

## GitHub Pages

`.github/workflows/deploy.yml` にGitHub Pages用の自動公開ワークフローを入れています。

1. GitHubにリポジトリを作成
2. このプロジェクトを `main` ブランチにpush
3. `Settings > Pages` で `GitHub Actions` を選択
4. `VITE_ACCESS_CODE_HASH` をActions Secretに追加
5. `main` にpushすると自動公開
