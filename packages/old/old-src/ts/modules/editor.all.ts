/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'monaco-editor/esm/vs/editor/browser/coreCommands.js.js';
import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js.js';
import 'monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js.js';
import 'monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js.js';
import 'monaco-editor/esm/vs/editor/contrib/anchorSelect/browser/anchorSelect.js.js';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching.js.js';
import 'monaco-editor/esm/vs/editor/contrib/caretOperations/browser/caretOperations.js.js';
import 'monaco-editor/esm/vs/editor/contrib/caretOperations/browser/transpose.js.js';
import 'monaco-editor/esm/vs/editor/contrib/clipboard/browser/clipboard.js.js';
import 'monaco-editor/esm/vs/editor/contrib/codeAction/browser/codeActionContributions.js.js';
import 'monaco-editor/esm/vs/editor/contrib/codelens/browser/codelensController.js.js';
import 'monaco-editor/esm/vs/editor/contrib/colorPicker/browser/colorContributions.js.js';
import 'monaco-editor/esm/vs/editor/contrib/comment/browser/comment.js.js';
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js.js';
import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/browser/cursorUndo.js.js';
import 'monaco-editor/esm/vs/editor/contrib/dnd/browser/dnd.js.js';
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js.js';
import 'monaco-editor/esm/vs/editor/contrib/folding/browser/folding.js.js';
import 'monaco-editor/esm/vs/editor/contrib/fontZoom/browser/fontZoom.js.js';
import 'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions.js.js';
import 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/documentSymbols.js.js';
import 'monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/inlineCompletionsContribution.js.js';
import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/goToCommands.js.js';
import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.js.js';
import 'monaco-editor/esm/vs/editor/contrib/gotoError/browser/gotoError.js.js';
import 'monaco-editor/esm/vs/editor/contrib/hover/browser/hover.js.js';
import 'monaco-editor/esm/vs/editor/contrib/indentation/browser/indentation.js.js';
import 'monaco-editor/esm/vs/editor/contrib/inlayHints/browser/inlayHintsContribution.js.js';
import 'monaco-editor/esm/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace.js.js';
import 'monaco-editor/esm/vs/editor/contrib/lineSelection/browser/lineSelection.js.js';
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/browser/linesOperations.js.js';
import 'monaco-editor/esm/vs/editor/contrib/linkedEditing/browser/linkedEditing.js.js';
import 'monaco-editor/esm/vs/editor/contrib/links/browser/links.js.js';
import 'monaco-editor/esm/vs/editor/contrib/multicursor/browser/multicursor.js.js';
import 'monaco-editor/esm/vs/editor/contrib/parameterHints/browser/parameterHints.js.js';
import 'monaco-editor/esm/vs/editor/contrib/rename/browser/rename.js.js';
import 'monaco-editor/esm/vs/editor/contrib/smartSelect/browser/smartSelect.js.js';
import 'monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetController2.js.js';
import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js.js';
import 'monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization.js.js';
import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode.js.js';
import 'monaco-editor/esm/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.js.js';
import 'monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/browser/unusualLineTerminators.js.js';
import 'monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/browser/viewportSemanticTokens.js.js';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.js.js';
import 'monaco-editor/esm/vs/editor/contrib/wordOperations/browser/wordOperations.js.js';
import 'monaco-editor/esm/vs/editor/contrib/wordPartOperations/browser/wordPartOperations.js.js';
// Load up these strings even in VSCode, even if they are not used
// in order to get them translated
import 'monaco-editor/esm/vs/editor/common/standaloneStrings.js.js';
// import '../../../node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codiconStyles.js'; // The codicons are defined here and must be loaded
