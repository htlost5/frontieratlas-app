---
agent: TST
task_id: TASK-refactor-001
date: 2026-07-20
status: pending
category: log
destination: docs/logs/impl/testing/
tags:
  - TST
  - testing
  - typecheck
  - lint
---

# Testing Log — リファクタ後 Lint / 型チェック

## 実行コマンド

| 試験 | コマンド | 結果 |
|------|----------|------|
| ESLint | `npx expo lint` | **FAIL** — 1 error, 4 warnings |
| TypeScript 型チェック | `npx tsc --noEmit` | **PASS** — エラー0件 |

## Lint Error（1件）

| ファイル | 行 | ルール | 内容 |
|---------|----|--------|------|
| `src/features/home/map/MapRoot.tsx` | 97 | `react-hooks/set-state-in-effect` | Effect内で同期的に `setHighlightedSearchResult()` を呼び出している。カスケードレンダリングを引き起こす可能性があり、パフォーマンス上の問題が懸念される |

## Lint Warning（4件）

| ファイル | 行 | ルール | 内容 |
|---------|----|--------|------|
| `app/(tabs)/home/index.tsx` | 2 | `@typescript-eslint/no-unused-vars` | `import React` が未使用 |
| `src/features/home/map/MapRoot.tsx` | 122 | `react-hooks/exhaustive-deps` | `useMemo` 依存配列に `flyToSearchResult`, `moveTo`, `wrappedSetFloor` が不足 |
| `src/features/home/map/MapScreen.tsx` | 70 | `@typescript-eslint/no-unused-vars` | `const vb` が未使用 |
| `src/features/home/search/hooks/useSearchIndex.ts` | 9 | `@typescript-eslint/no-unused-vars` | `invalidateSearchIndexCache` が未使用 |

## 型チェック結果

`npx tsc --noEmit` — エラー0件 ✅

## 総合判定

**不合格 ❌** — lint error 1件により不合格。型チェックは PASS だが、Tester 判定基準により不合格とする。

## 推奨アクション

IMP に以下を差し戻し:
1. `MapRoot.tsx:97` — Effect 内の同期的 `setState` を修正。SearchResult 変更時の state 同期に Effect ではなく適切な方法（例: useReducer への統合、または Effect 内カスケードの flatten）を検討
2. 上記 Warnings も可能な範囲で解消推奨
