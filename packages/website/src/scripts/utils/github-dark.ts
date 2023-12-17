export default {
  name: "github-dark",
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "#8B949E" },
    { token: "punctuation.definition.comment", foreground: "#8B949E" },
    { token: "string.comment", foreground: "#8B949E" },
    { token: "constant", foreground: "#79C0FF" },
    { token: "entity.name.constant", foreground: "#79C0FF" },
    { token: "variable.other.constant", foreground: "#79C0FF" },
    { token: "variable.language", foreground: "#79C0FF" },
    { token: "entity", foreground: "#79C0FF" },
    { token: "entity.name", foreground: "#FFA657" },
    { token: "meta.export.default", foreground: "#FFA657" },
    { token: "meta.definition.variable", foreground: "#FFA657" },
    { token: "variable.parameter.function", foreground: "#C9D1D9" },
    { token: "meta.jsx.children", foreground: "#C9D1D9" },
    { token: "meta.block", foreground: "#C9D1D9" },
    { token: "meta.tag.attributes", foreground: "#C9D1D9" },
    { token: "entity.name.constant", foreground: "#C9D1D9" },
    { token: "meta.object.member", foreground: "#C9D1D9" },
    { token: "meta.embedded.expression", foreground: "#C9D1D9" },
    { token: "entity.name.function", foreground: "#D2A8FF" },
    { token: "entity.name.tag", foreground: "#7EE787" },
    { token: "support.class.component", foreground: "#7EE787" },
    { token: "keyword", foreground: "#FF7B72" },
    { token: "storage", foreground: "#FF7B72" },
    { token: "storage.type", foreground: "#FF7B72" },
    { token: "storage.modifier.package", foreground: "#C9D1D9" },
    { token: "storage.modifier.import", foreground: "#C9D1D9" },
    { token: "storage.type.java", foreground: "#C9D1D9" },
    { token: "string", foreground: "#A5D6FF" },
    { token: "punctuation.definition.string", foreground: "#A5D6FF" },
    {
      token: "string punctuation.section.embedded source",
      foreground: "#A5D6FF"
    },
    { token: "support", foreground: "#79C0FF" },
    { token: "meta.property-name", foreground: "#79C0FF" },
    { token: "variable", foreground: "#FFA657" },
    { token: "variable.other", foreground: "#C9D1D9" },
    {
      token: "invalid.broken",
      foreground: "#FFA198",
      fontStyle: "italic"
    },
    {
      token: "invalid.deprecated",
      foreground: "#FFA198",
      fontStyle: "italic"
    },
    {
      token: "invalid.illegal",
      foreground: "#FFA198",
      fontStyle: "italic"
    },
    {
      token: "invalid.unimplemented",
      foreground: "#FFA198",
      fontStyle: "italic"
    },
    {
      token: "carriage-return",
      foreground: "#0D1117",
      background: "#FF7B72",
      fontStyle: "italic underline"
    },
    { token: "message.error", foreground: "#FFA198" },
    { token: "string source", foreground: "#C9D1D9" },
    { token: "string variable", foreground: "#79C0FF" },
    { token: "source.regexp", foreground: "#A5D6FF" },
    { token: "string.regexp", foreground: "#A5D6FF" },
    { token: "string.regexp.character-class", foreground: "#A5D6FF" },
    {
      token: "string.regexp constant.character.escape",
      foreground: "#A5D6FF"
    },
    {
      token: "string.regexp source.ruby.embedded",
      foreground: "#A5D6FF"
    },
    {
      token: "string.regexp string.regexp.arbitrary-repitition",
      foreground: "#A5D6FF"
    },
    {
      token: "string.regexp constant.character.escape",
      foreground: "#7EE787",
      fontStyle: "bold"
    },
    { token: "support.constant", foreground: "#79C0FF" },
    { token: "support.variable", foreground: "#79C0FF" },
    { token: "meta.module-reference", foreground: "#79C0FF" },
    {
      token: "punctuation.definition.list.begin.markdown",
      foreground: "#FFA657"
    },
    { token: "markup.heading", foreground: "#79C0FF", fontStyle: "bold" },
    {
      token: "markup.heading entity.name",
      foreground: "#79C0FF",
      fontStyle: "bold"
    },
    { token: "markup.quote", foreground: "#7EE787" },
    {
      token: "markup.italic",
      foreground: "#C9D1D9",
      fontStyle: "italic"
    },
    { token: "markup.bold", foreground: "#C9D1D9", fontStyle: "bold" },
    { token: "markup.raw", foreground: "#79C0FF" },
    {
      token: "markup.deleted",
      foreground: "#FFA198",
      background: "#490202"
    },
    {
      token: "meta.diff.header.from-file",
      foreground: "#FFA198",
      background: "#490202"
    },
    {
      token: "punctuation.definition.deleted",
      foreground: "#FFA198",
      background: "#490202"
    },
    {
      token: "markup.inserted",
      foreground: "#7EE787",
      background: "#04260F"
    },
    {
      token: "meta.diff.header.to-file",
      foreground: "#7EE787",
      background: "#04260F"
    },
    {
      token: "punctuation.definition.inserted",
      foreground: "#7EE787",
      background: "#04260F"
    },
    {
      token: "markup.changed",
      foreground: "#FFA657",
      background: "#5A1E02"
    },
    {
      token: "punctuation.definition.changed",
      foreground: "#FFA657",
      background: "#5A1E02"
    },
    {
      token: "markup.ignored",
      foreground: "#161B22",
      background: "#79C0FF"
    },
    {
      token: "markup.untracked",
      foreground: "#161B22",
      background: "#79C0FF"
    },
    {
      token: "meta.diff.range",
      foreground: "#D2A8FF",
      fontStyle: "bold"
    },
    { token: "meta.diff.header", foreground: "#79C0FF" },
    { token: "meta.separator", foreground: "#79C0FF", fontStyle: "bold" },
    { token: "meta.output", foreground: "#79C0FF" },
    { token: "brackethighlighter.tag", foreground: "#8B949E" },
    { token: "brackethighlighter.curly", foreground: "#8B949E" },
    { token: "brackethighlighter.round", foreground: "#8B949E" },
    { token: "brackethighlighter.square", foreground: "#8B949E" },
    { token: "brackethighlighter.angle", foreground: "#8B949E" },
    { token: "brackethighlighter.quote", foreground: "#8B949E" },
    { token: "brackethighlighter.unmatched", foreground: "#FFA198" },
    {
      token: "constant.other.reference.link",
      foreground: "#A5D6FF",
      fontStyle: "underline"
    },
    {
      token: "string.other.link",
      foreground: "#A5D6FF",
      fontStyle: "underline"
    },
    { token: "token.info-token", foreground: "#6796E6" },
    { token: "token.warn-token", foreground: "#CD9731" },
    { token: "token.error-token", foreground: "#F44747" },
    { token: "token.debug-token", foreground: "#B267E6" },
  ],
  colors: {
    "activityBar.activeBorder": "#f78166",
    "activityBar.background": "#0d1117",
    "activityBar.border": "#30363d",
    "activityBar.foreground": "#c9d1d9",
    "activityBar.inactiveForeground": "#8b949e",
    "activityBarBadge.background": "#1f6feb",
    "activityBarBadge.foreground": "#f0f6fc",
    "badge.background": "#1f6feb",
    "badge.foreground": "#f0f6fc",
    "breadcrumb.activeSelectionForeground": "#8b949e",
    "breadcrumb.focusForeground": "#c9d1d9",
    "breadcrumb.foreground": "#8b949e",
    "breadcrumbPicker.background": "#161b22",
    "button.background": "#238636",
    "button.foreground": "#ffffff",
    "button.hoverBackground": "#2ea043",
    "button.secondaryBackground": "#282e33",
    "button.secondaryForeground": "#c9d1d9",
    "button.secondaryHoverBackground": "#30363d",
    "checkbox.background": "#161b22",
    "checkbox.border": "#30363d",
    "debugToolBar.background": "#161b22",
    "descriptionForeground": "#8b949e",
    "diffEditor.insertedTextBackground": "#2ea04326",
    "diffEditor.removedTextBackground": "#f8514926",
    "dropdown.background": "#161b22",
    "dropdown.border": "#30363d",
    "dropdown.foreground": "#c9d1d9",
    "dropdown.listBackground": "#161b22",
    "editor.background": "#0d1117",
    "editor.findMatchBackground": "#ffd33d44",
    "editor.findMatchHighlightBackground": "#ffd33d22",
    "editor.focusedStackFrameHighlightBackground": "#3fb95025",
    "editor.foldBackground": "#6e76811a",
    "editor.foreground": "#c9d1d9",
    "editor.inactiveSelectionBackground": "#3392ff22",
    "editor.lineHighlightBackground": "#6e76811a",
    "editor.linkedEditingBackground": "#3392ff22",
    "editor.selectionBackground": "#3392ff44",
    "editor.selectionHighlightBackground": "#17e5e633",
    "editor.selectionHighlightBorder": "#17e5e600",
    "editor.stackFrameHighlightBackground": "#d2992225",
    "editor.wordHighlightBackground": "#17e5e600",
    "editor.wordHighlightBorder": "#17e5e699",
    "editor.wordHighlightStrongBackground": "#17e5e600",
    "editor.wordHighlightStrongBorder": "#17e5e666",
    "editorBracketMatch.background": "#17e5e650",
    "editorBracketMatch.border": "#17e5e600",
    "editorCursor.foreground": "#58a6ff",
    "editorGroup.border": "#30363d",
    "editorGroupHeader.tabsBackground": "#010409",
    "editorGroupHeader.tabsBorder": "#30363d",
    "editorGutter.addedBackground": "#2ea04366",
    "editorGutter.deletedBackground": "#f8514966",
    "editorGutter.modifiedBackground": "#bb800966",
    "editorIndentGuide.activeBackground": "#30363d",
    "editorIndentGuide.background": "#21262d",
    "editorLineNumber.activeForeground": "#c9d1d9",
    "editorLineNumber.foreground": "#8b949e",
    "editorOverviewRuler.border": "#010409",
    "editorWhitespace.foreground": "#484f58",
    "editorWidget.background": "#161b22",
    "errorForeground": "#f85149",
    "focusBorder": "#1f6feb",
    "foreground": "#c9d1d9",
    "gitDecoration.addedResourceForeground": "#3fb950",
    "gitDecoration.conflictingResourceForeground": "#db6d28",
    "gitDecoration.deletedResourceForeground": "#f85149",
    "gitDecoration.ignoredResourceForeground": "#484f58",
    "gitDecoration.modifiedResourceForeground": "#d29922",
    "gitDecoration.submoduleResourceForeground": "#8b949e",
    "gitDecoration.untrackedResourceForeground": "#3fb950",
    "input.background": "#0d1117",
    "input.border": "#30363d",
    "input.foreground": "#c9d1d9",
    "input.placeholderForeground": "#484f58",
    "list.activeSelectionBackground": "#6e768166",
    "list.activeSelectionForeground": "#c9d1d9",
    "list.focusBackground": "#388bfd26",
    "list.focusForeground": "#c9d1d9",
    "list.highlightForeground": "#58a6ff",
    "list.hoverBackground": "#6e76811a",
    "list.hoverForeground": "#c9d1d9",
    "list.inactiveFocusBackground": "#388bfd26",
    "list.inactiveSelectionBackground": "#6e768166",
    "list.inactiveSelectionForeground": "#c9d1d9",
    "notificationCenterHeader.background": "#161b22",
    "notificationCenterHeader.foreground": "#8b949e",
    "notifications.background": "#161b22",
    "notifications.border": "#30363d",
    "notifications.foreground": "#c9d1d9",
    "notificationsErrorIcon.foreground": "#f85149",
    "notificationsInfoIcon.foreground": "#58a6ff",
    "notificationsWarningIcon.foreground": "#d29922",
    "panel.background": "#010409",
    "panel.border": "#30363d",
    "panelInput.border": "#30363d",
    "panelTitle.activeBorder": "#f78166",
    "panelTitle.activeForeground": "#c9d1d9",
    "panelTitle.inactiveForeground": "#8b949e",
    "peekViewEditor.background": "#0d111788",
    "peekViewEditor.matchHighlightBackground": "#ffd33d33",
    "peekViewResult.background": "#0d1117",
    "peekViewResult.matchHighlightBackground": "#ffd33d33",
    "pickerGroup.border": "#30363d",
    "pickerGroup.foreground": "#8b949e",
    "progressBar.background": "#1f6feb",
    "quickInput.background": "#161b22",
    "quickInput.foreground": "#c9d1d9",
    "scrollbar.shadow": "#00000088",
    "scrollbarSlider.activeBackground": "#484f5888",
    "scrollbarSlider.background": "#484f5833",
    "scrollbarSlider.hoverBackground": "#484f5844",
    "settings.headerForeground": "#8b949e",
    "settings.modifiedItemIndicator": "#bb800966",
    "sideBar.background": "#010409",
    "sideBar.border": "#30363d",
    "sideBar.foreground": "#c9d1d9",
    "sideBarSectionHeader.background": "#010409",
    "sideBarSectionHeader.border": "#30363d",
    "sideBarSectionHeader.foreground": "#c9d1d9",
    "sideBarTitle.foreground": "#c9d1d9",
    "statusBar.background": "#0d1117",
    "statusBar.border": "#30363d",
    "statusBar.debuggingBackground": "#da3633",
    "statusBar.debuggingForeground": "#f0f6fc",
    "statusBar.foreground": "#8b949e",
    "statusBar.noFolderBackground": "#0d1117",
    "statusBarItem.prominentBackground": "#161b22",
    "tab.activeBackground": "#0d1117",
    "tab.activeBorder": "#0d1117",
    "tab.activeBorderTop": "#f78166",
    "tab.activeForeground": "#c9d1d9",
    "tab.border": "#30363d",
    "tab.hoverBackground": "#0d1117",
    "tab.inactiveBackground": "#010409",
    "tab.inactiveForeground": "#8b949e",
    "tab.unfocusedActiveBorder": "#0d1117",
    "tab.unfocusedActiveBorderTop": "#30363d",
    "tab.unfocusedHoverBackground": "#6e76811a",
    "terminal.ansiBlack": "#484f58",
    "terminal.ansiBlue": "#58a6ff",
    "terminal.ansiBrightBlack": "#6e7681",
    "terminal.ansiBrightBlue": "#79c0ff",
    "terminal.ansiBrightCyan": "#56d4dd",
    "terminal.ansiBrightGreen": "#56d364",
    "terminal.ansiBrightMagenta": "#d2a8ff",
    "terminal.ansiBrightRed": "#ffa198",
    "terminal.ansiBrightWhite": "#f0f6fc",
    "terminal.ansiBrightYellow": "#e3b341",
    "terminal.ansiCyan": "#39c5cf",
    "terminal.ansiGreen": "#3fb950",
    "terminal.ansiMagenta": "#bc8cff",
    "terminal.ansiRed": "#ff7b72",
    "terminal.ansiWhite": "#b1bac4",
    "terminal.ansiYellow": "#d29922",
    "terminal.foreground": "#8b949e",
    "textBlockQuote.background": "#010409",
    "textBlockQuote.border": "#30363d",
    "textCodeBlock.background": "#6e768166",
    "textLink.activeForeground": "#58a6ff",
    "textLink.foreground": "#58a6ff",
    "textPreformat.foreground": "#8b949e",
    "textSeparator.foreground": "#21262d",
    "titleBar.activeBackground": "#0d1117",
    "titleBar.activeForeground": "#8b949e",
    "titleBar.border": "#30363d",
    "titleBar.inactiveBackground": "#010409",
    "titleBar.inactiveForeground": "#8b949e",
    "tree.indentGuidesStroke": "#21262d",
    "welcomePage.buttonBackground": "#21262d",
    "welcomePage.buttonHoverBackground": "#30363d",
  }
};