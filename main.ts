import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DRIVE_URL } from './drive';
// Remember to rename these classes and interfaces!

interface SettingConfig {
	name: string;
	description: string;
	placeholder: string;
	value: string;
}

interface PluginSettings {
	driveApiKey: SettingConfig;
	driveApiSecret: SettingConfig;
}

const DEFAULT_SETTINGS: PluginSettings = {
	driveApiKey: {
		name: 'Drive API Key',
		description: 'API key to access the Drive API',
		placeholder: 'YOUR_API_KEY',
		value: ''
	},
	driveApiSecret: {
		name: 'Drive API Secret',
		description: 'API Secret to access the Drive API',
		placeholder: 'YOUR_API_SECRET',
		value: ''
	},
}

export default class GoogleDriveSync extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice("It's ya booooooiiiiiii!");
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SettingsTab extends PluginSettingTab {
	plugin: GoogleDriveSync;

	constructor(app: App, plugin: GoogleDriveSync) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		let driveApiKeyConfig: SettingConfig = this.plugin.settings.driveApiKey
		new Setting(containerEl)
			.setName(driveApiKeyConfig.name)
			.setDesc(driveApiKeyConfig.description)
			.addText(text => text
				.setPlaceholder(driveApiKeyConfig.placeholder)
				.setValue(driveApiKeyConfig.value)
				.onChange(async (value) => {
					driveApiKeyConfig.value = value;
					await this.plugin.saveSettings();
				}));
	
		let driveApiSecretConfig: SettingConfig = this.plugin.settings.driveApiSecret
		new Setting(containerEl)
			.setName(driveApiSecretConfig.name)
			.setDesc(driveApiSecretConfig.description)
			.addText(text => text
				.setPlaceholder(driveApiSecretConfig.placeholder)
				.setValue(driveApiSecretConfig.value)
				.onChange(async (value) => {
					driveApiSecretConfig.value = value;
					await this.plugin.saveSettings();
				}));
	}
}