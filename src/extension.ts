// The module 'vscode' contains the VS Code extensibility API
import {
  commands,
  ConfigurationTarget,
  type ExtensionContext,
  type TextEditor,
  window,
  workspace,
} from 'vscode';

const EXTENSION_ID = 'autoCollapseExplorer';
const ACTIVE_COMMAND = `${EXTENSION_ID}.toggle-active`;
const ACTIVE_CONFIG = 'active';
const ACTIVE_ON_STARTUP_CONFIG = 'alwaysActiveOnStartup';

const COLLAPSE = 'workbench.files.action.collapseExplorerFolders';
const REVEAL = 'revealInExplorer';
const FOCUS_EDITOR = 'workbench.action.focusActiveEditorGroup';

// this method is called when your extension is activated
export function activate(context: ExtensionContext) {
  handleStartupActivation();

  const toggleCommand = commands.registerCommand(
    ACTIVE_COMMAND,
    toggleExtensionActive,
  );
  const subscription = window.onDidChangeActiveTextEditor(showOnlyCurrentFile);

  context.subscriptions.push(toggleCommand);
  context.subscriptions.push(subscription);
}

function handleStartupActivation() {
  const config = workspace.getConfiguration(EXTENSION_ID);
  if (config.get<boolean>(ACTIVE_ON_STARTUP_CONFIG)) {
    config.update(ACTIVE_CONFIG, true, ConfigurationTarget.Global);
  }
}

function toggleExtensionActive() {
  const config = workspace.getConfiguration(EXTENSION_ID);
  const extensionActive = config.get<boolean>(ACTIVE_CONFIG);

  config
    .update(ACTIVE_CONFIG, !extensionActive, ConfigurationTarget.Global)
    .then(() => {
      window.showInformationMessage(
        !extensionActive
          ? 'Enabled Auto-Collapse Explorer'
          : 'Disabled Auto-Collapse Explorer',
      );
    });
}

async function showOnlyCurrentFile(textEditor: TextEditor | undefined) {
  const config = workspace.getConfiguration(EXTENSION_ID);
  const extensionActive = config.get<boolean>(ACTIVE_CONFIG);
  if (!extensionActive) {
    return;
  }

  const fileExpectedInExplorer = textEditor?.document.uri.scheme === 'file';
  if (!fileExpectedInExplorer) {
    return;
  }

  await commands.executeCommand(COLLAPSE);
  await commands.executeCommand(REVEAL);
  await commands.executeCommand(FOCUS_EDITOR);
}

// this method is called when your extension is deactivated
export function deactivate() {}
