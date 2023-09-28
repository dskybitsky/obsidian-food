import { Plugin as ObsidianPlugin } from 'obsidian';

export interface Settings {
    currency: string;
}

export interface PluginInterface extends ObsidianPlugin {
    settings: Settings,

    saveSettings(): Promise<void>;
}
