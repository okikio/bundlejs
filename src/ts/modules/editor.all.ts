/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import '../../../node_modules/monaco-editor/esm/vs/editor/browser/coreCommands.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/anchorSelect/browser/anchorSelect.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/browser/caretOperations.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/browser/transpose.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/clipboard/browser/clipboard.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/browser/codeActionContributions.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/codelens/browser/codelensController.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/browser/colorContributions.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/comment/browser/comment.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/cursorUndo/browser/cursorUndo.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/dnd/browser/dnd.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/folding/browser/folding.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/fontZoom/browser/fontZoom.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/format/browser/formatActions.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/documentSymbols.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/inlineCompletionsContribution.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/goToCommands.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/browser/gotoError.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/hover/browser/hover.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/indentation/browser/indentation.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/inlayHints/browser/inlayHintsContribution.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/lineSelection/browser/lineSelection.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/browser/linesOperations.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/linkedEditing/browser/linkedEditing.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/links/browser/links.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/multicursor/browser/multicursor.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/browser/parameterHints.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/rename/browser/rename.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/browser/smartSelect.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetController2.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/browser/unusualLineTerminators.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/browser/viewportSemanticTokens.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordOperations/browser/wordOperations.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordPartOperations/browser/wordPartOperations.js';
// Load up these strings even in VSCode, even if they are not used
// in order to get them translated
import '../../../node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings.js';
import '../../../node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codiconStyles.js'; // The codicons are defined here and must be loaded
