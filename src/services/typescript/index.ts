import * as monaco from 'monaco-editor';
import type { Settings } from '../../types';

// monaco.languages.typescript is typed as deprecated in 0.57 types but
// fully functional at runtime — the TypeScript contribution registers itself
// when the monaco-editor package is imported.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tsLang = () => (monaco.languages as any).typescript as any;

export function configureTypeScript(ts: Settings['typescript']) {
  const lang = tsLang();
  if (!lang?.typescriptDefaults) return;

  const compilerOptions = {
    target: lang.ScriptTarget?.ESNext ?? 99,
    module: lang.ModuleKind?.ESNext ?? 99,
    moduleResolution: lang.ModuleResolutionKind?.Bundler ?? 100,
    jsx: lang.JsxEmit?.ReactJSX ?? 4,
    strict: ts.strictMode,
    noImplicitAny: ts.strictMode,
    strictNullChecks: ts.strictMode,
    allowJs: true,
    checkJs: false,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    experimentalDecorators: true,
    lib: ['esnext', 'dom', 'dom.iterable'],
  };

  lang.typescriptDefaults.setCompilerOptions(compilerOptions);
  lang.javascriptDefaults.setCompilerOptions({
    ...compilerOptions,
    strict: false,
    noImplicitAny: false,
    checkJs: true,
  });

  const diagnostics = {
    noSemanticValidation: !ts.validateOnType,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: false,
  };

  lang.typescriptDefaults.setDiagnosticsOptions(diagnostics);
  lang.javascriptDefaults.setDiagnosticsOptions(diagnostics);

  lang.typescriptDefaults.setInlayHintsOptions?.({
    includeInlayParameterNameHints: ts.inlayHints ? 'literals' : 'none',
    includeInlayParameterNameHintsWhenArgumentMatchesName: false,
    includeInlayFunctionParameterTypeHints: ts.inlayHints,
    includeInlayVariableTypeHints: ts.inlayHints,
    includeInlayPropertyDeclarationTypeHints: ts.inlayHints,
    includeInlayFunctionLikeReturnTypeHints: ts.inlayHints,
    includeInlayEnumMemberValueHints: ts.inlayHints,
  });
}

export async function getHoverInfo(
  model: monaco.editor.ITextModel,
  position: monaco.Position,
): Promise<{ type: string; documentation: string } | null> {
  const lang = tsLang();
  if (!lang) return null;

  const langId = model.getLanguageId();
  const isTs = langId === 'typescript' || langId === 'typescriptreact';
  const isJs = langId === 'javascript' || langId === 'javascriptreact';
  if (!isTs && !isJs) return null;

  try {
    const getWorker = isTs ? lang.getTypeScriptWorker : lang.getJavaScriptWorker;
    if (!getWorker) return null;
    const workerFactory = await getWorker();
    const client = await workerFactory(model.uri);
    const offset = model.getOffsetAt(position);
    const quickInfo = await (client as any).getQuickInfoAtPosition(
      model.uri.toString(),
      offset,
    );

    if (!quickInfo?.displayParts?.length) return null;

    const type = quickInfo.displayParts.map((p: any) => p.text).join('');
    const documentation = (quickInfo.documentation ?? []).map((d: any) => d.text).join('\n');
    return { type, documentation };
  } catch {
    return null;
  }
}
