import { App, PluginSettingTab, Setting } from 'obsidian';
import { PluginInterface } from '../../types';

export class SettingTab extends PluginSettingTab {
    constructor(
        app: App,
        protected plugin: PluginInterface,
    ) {
        super(app, plugin);
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Currency')
            .setDesc('String to use as a currency symbol, i.e. $,€. Default - empty.')
            .addText((text) => text
                .setPlaceholder('Enter your currency')
                .setValue(this.plugin.settings.currency)
                .onChange(async (value) => {
                    this.plugin.settings.currency = value;
                    await this.plugin.saveSettings();
                }));
    }
}
