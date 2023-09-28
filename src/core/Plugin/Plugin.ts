import {App, Modal, Setting} from 'obsidian';
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
                () => createElement(Day, {
                    onScan: (setCode) => {
                        new SampleModal(this.app, this.codeReader, setCode)
                            .open();
                    }
                }),
            ),
        );
    }

    protected processBlock(
        container: HTMLElement,
        context: MarkdownPostProcessorContext,
        elementFactory: () => ReactElement,
    ): void {
        const root = createRoot(container);

        const containerFactory = () => createElement(SettingsContext.Provider, {
            value: this.settings,
        }, createElement(Container, {
            loading: !this.dataviewApi.index.initialized,
            className: 'sbs-food',
        }, elementFactory()));

        this.registerElement(root, context.sourcePath, containerFactory);

        root.render(containerFactory());
    }
}

class SampleModal extends Modal {
    constructor(
        app: App,
        protected codeReader: BrowserMultiFormatReader,
        protected onSubmit: (result: string) => void
    ) {
        super(app);
    }

    onOpen() {
        const {contentEl} = this;

        const videoEl = contentEl.createEl('video', {
                attr: {
                    id: 'video',
                    width: '300',
                    height: '200'
                },
            },
        );

        const resultEl = contentEl.createEl('span', { attr: { id: 'result' }});

        this.codeReader.decodeFromVideoDevice(null, videoEl, ((result: any) => {
            if (result && result.text) {
                resultEl.setText(result.text);
            }
        }));

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Submit")
                    .setCta()
                    .onClick(() => {
                        this.close();
                        this.onSubmit(resultEl.getText());
                    }));
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}

const DefaultSettings: Settings = {
    currency: '',
};
