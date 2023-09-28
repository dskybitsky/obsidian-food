import {App, Modal} from 'obsidian';
import type { MarkdownPostProcessorContext, PluginManifest } from 'obsidian';
import { createRoot } from 'react-dom/client';
import { createElement, ReactElement } from 'react';
import {
    Container,
    ReactPlugin,
    Reader,
    Writer,
} from 'skybitsky-common';
import {
    Day,
} from '../../ui';
import {
    SBS_FOOD_DAY,
} from '../constants';
import { PluginInterface, Settings } from '../types';
import { SettingsContext } from '../contexts';
import './Plugin.css';
import { SettingTab } from './SettingTab';
import { BrowserMultiFormatReader } from '@zxing/library';

export class Plugin extends ReactPlugin implements PluginInterface {
    settings: Settings = DefaultSettings;
    codeReader: BrowserMultiFormatReader;

    reader: Reader;

    writer: Writer;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);

        this.reader = new Reader(this.dataviewApi);
        this.writer = new Writer(app.vault);
        this.codeReader = new BrowserMultiFormatReader();
    }

    async onload() {
        await this.loadSettings();

        super.onload();

        this.registerMarkdownCodeBlockProcessors();
        this.addSettingTab(new SettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = {
            ...DefaultSettings,
            ...await this.loadData(),
        };
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.renderAllRoots();
    }

    protected registerMarkdownCodeBlockProcessors(): void {
        this.registerMarkdownCodeBlockProcessor(
            CSS.escape(SBS_FOOD_DAY),
            (_, container, context) => this.processBlock(
                container,
                context,
                () => createElement(Day),
            ),
        );
    }

    protected processBlock(
        container: HTMLElement,
        context: MarkdownPostProcessorContext,
        elementFactory: () => ReactElement,
    ): void {

        const videoEl = container.createEl('video', {
                attr: {
                    id: 'video',
                    width: '300',
                    height: '200'
                },
            },
        );

        const resultEl = container.createEl('span', { attr: { id: 'result' }});

        this.codeReader.decodeFromVideoDevice(null, videoEl, ((result: any) => {
            console.log(result);

            resultEl.setText(JSON.stringify(result));
        }));

        resultEl.setText('Result');
    }
}

const DefaultSettings: Settings = {
    currency: '',
};
