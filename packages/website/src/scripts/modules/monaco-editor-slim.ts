/// <reference types="monaco-editor" />
// import "monaco-editor/esm/vs/basic-languages/monaco.contribution";

import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
// import "monaco-editor/esm/vs/basic-languages/html/html.contribution";
// import "monaco-editor/esm/vs/basic-languages/css/css.contribution";

// import 'monaco-editor/esm/vs/language/css/monaco.contribution';
// import 'monaco-editor/esm/vs/language/html/monaco.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'monaco-editor/esm/vs/editor/browser/coreCommands.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js';
// import 'monaco-editor/esm/vs/editor/contrib/anchorSelect/browser/anchorSelect.js';
// import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching.js';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/browser/caretOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/browser/transpose.js';
// import 'monaco-editor/esm/vs/editor/contrib/clipboard/browser/clipboard.js';
// import 'monaco-editor/esm/vs/editor/contrib/codeAction/browser/codeActionContributions.js';
// import 'monaco-editor/esm/vs/editor/contrib/codelens/browser/codelensController.js';
// import 'monaco-editor/esm/vs/editor/contrib/colorPicker/browser/colorContributions.js';
// import 'monaco-editor/esm/vs/editor/contrib/copyPaste/browser/copyPasteContribution.js';
// import 'monaco-editor/esm/vs/editor/contrib/comment/browser/comment.js';
// import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js';
// import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/browser/cursorUndo.js';
// import 'monaco-editor/esm/vs/editor/contrib/dnd/browser/dnd.js';
// import 'monaco-editor/esm/vs/editor/contrib/dropIntoEditor/browser/dropIntoEditorContribution.js';
// import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';
// import 'monaco-editor/esm/vs/editor/contrib/folding/browser/folding.js';
// import 'monaco-editor/esm/vs/editor/contrib/fontZoom/browser/fontZoom.js';
// import 'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions.js';
// import 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/documentSymbols.js';
// import 'monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/ghostText.contribution.js';
// import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/goToCommands.js';
// import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.js';
// import 'monaco-editor/esm/vs/editor/contrib/gotoError/browser/gotoError.js';
// import 'monaco-editor/esm/vs/editor/contrib/hover/browser/hover.js';
// import 'monaco-editor/esm/vs/editor/contrib/indentation/browser/indentation.js';
// import 'monaco-editor/esm/vs/editor/contrib/inlayHints/browser/inlayHintsContribution.js';
// import 'monaco-editor/esm/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace.js';
// import 'monaco-editor/esm/vs/editor/contrib/lineSelection/browser/lineSelection.js';
// import 'monaco-editor/esm/vs/editor/contrib/linesOperations/browser/linesOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/linkedEditing/browser/linkedEditing.js';
// import 'monaco-editor/esm/vs/editor/contrib/links/browser/links.js';
// import 'monaco-editor/esm/vs/editor/contrib/longLinesHelper/browser/longLinesHelper.js';
// import 'monaco-editor/esm/vs/editor/contrib/multicursor/browser/multicursor.js';
// import 'monaco-editor/esm/vs/editor/contrib/parameterHints/browser/parameterHints.js';
// import 'monaco-editor/esm/vs/editor/contrib/rename/browser/rename.js';
// import 'monaco-editor/esm/vs/editor/contrib/stickyScroll/browser/stickyScrollContribution.js';
// import 'monaco-editor/esm/vs/editor/contrib/smartSelect/browser/smartSelect.js';
// import 'monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetController2.js';
// import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js';
// import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestInlineCompletions.js';
// import 'monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization.js';
// import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode.js';
// import 'monaco-editor/esm/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.js';
// import 'monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/browser/unusualLineTerminators.js';
// import 'monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/browser/viewportSemanticTokens.js';
// import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.js';
// import 'monaco-editor/esm/vs/editor/contrib/wordOperations/browser/wordOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/wordPartOperations/browser/wordPartOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/readOnlyMessage/browser/contribution.js';
// Load up these strings even in VSCode, even if they are not used
// in order to get them translated
import 'monaco-editor/esm/vs/editor/common/standaloneStrings.js';
import 'monaco-editor/esm/vs/base/browser/ui/codicons/codiconStyles.js'; // The codicons are defined here and must be loaded

// import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js';
export * from 'monaco-editor/esm/vs/editor/editor.api.js';

// export * from 'monaco-editor/esm/vs/editor/edcore.main';