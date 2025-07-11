/*
Copyright 2024 New Vector Ltd.
Copyright 2019 Michael Telatynski <7t3chguy@gmail.com>
Copyright 2019 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/500-italic.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/600-italic.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/700-italic.css";

import "@fontsource/inconsolata/latin-ext-400.css";
import "@fontsource/inconsolata/latin-400.css";
import "@fontsource/inconsolata/latin-ext-700.css";
import "@fontsource/inconsolata/latin-700.css";

import { logger } from "matrix-js-sdk/src/logger";

import { _t } from "./languageHandler";
import SettingsStore from "./settings/SettingsStore";
import ThemeWatcher from "./settings/watchers/ThemeWatcher";

export const DEFAULT_THEME = "light";
const HIGH_CONTRAST_THEMES: Record<string, string> = {
    light: "light-high-contrast",
};

interface IFontFaces extends Omit<Record<(typeof allowedFontFaceProps)[number], string>, "src"> {
    src: {
        format: string;
        url: string;
        local: string;
    }[];
}

interface CompoundTheme {
    [token: string]: string;
}

export type CustomTheme = {
    name: string;
    is_dark?: boolean; // eslint-disable-line camelcase
    colors?: {
        [key: string]: string;
    };
    fonts?: {
        faces: IFontFaces[];
        general: string;
        monospace: string;
    };
    compound?: CompoundTheme;
};

/**
 * Given a non-high-contrast theme, find the corresponding high-contrast one
 * if it exists, or return undefined if not.
 */
export function findHighContrastTheme(theme: string): string | undefined {
    return HIGH_CONTRAST_THEMES[theme];
}

/**
 * Given a high-contrast theme, find the corresponding non-high-contrast one
 * if it exists, or return undefined if not.
 */
export function findNonHighContrastTheme(hcTheme: string): string | undefined {
    for (const theme in HIGH_CONTRAST_THEMES) {
        if (HIGH_CONTRAST_THEMES[theme] === hcTheme) {
            return theme;
        }
    }
}

/**
 * Decide whether the supplied theme is high contrast.
 */
export function isHighContrastTheme(theme: string): boolean {
    return Object.values(HIGH_CONTRAST_THEMES).includes(theme);
}

export function enumerateThemes(): { [key: string]: string } {
    const BUILTIN_THEMES = {
        // "light": _t("common|light"), /* elecord, remove default light theme */
        "light-high-contrast": _t("theme|light_high_contrast"),
        "dark": _t("common|dark"),
    };
    const customThemes = SettingsStore.getValue("custom_themes") || [];
    const customThemeNames: Record<string, string> = {};

    try {
        for (const { name } of customThemes) {
            customThemeNames[`custom-${name}`] = name;
        }
    } catch (err) {
        logger.warn("Error loading custom themes", {
            err,
            customThemes,
        });
    }

    return Object.assign({}, customThemeNames, BUILTIN_THEMES);
}

export interface ITheme {
    id: string;
    name: string;
}

export function getOrderedThemes(): ITheme[] {
    const themes = Object.entries(enumerateThemes())
        .map((p) => ({ id: p[0], name: p[1] })) // convert pairs to objects for code readability
        .filter((p) => !isHighContrastTheme(p.id));
    const builtInThemes = themes.filter((p) => !p.id.startsWith("custom-"));
    const collator = new Intl.Collator();
    const customThemes = themes
        .filter((p) => !builtInThemes.includes(p))
        .sort((a, b) => collator.compare(a.name, b.name));
    return [...builtInThemes, ...customThemes];
}

function clearCustomTheme(): void {
    // remove all css variables, we assume these are there because of the custom theme
    const inlineStyleProps = Object.values(document.body.style);
    for (const prop of inlineStyleProps) {
        if (typeof prop === "string" && prop.startsWith("--")) {
            document.body.style.removeProperty(prop);
        }
    }

    // remove the custom style sheets
    document.querySelector("head > style[title='custom-theme-font-faces']")?.remove();
    document.querySelector("head > style[title='custom-theme-compound']")?.remove();
}

const allowedFontFaceProps = [
    "font-display",
    "font-family",
    "font-stretch",
    "font-style",
    "font-weight",
    "font-variant",
    "font-feature-settings",
    "font-variation-settings",
    "src",
    "unicode-range",
] as const;

function generateCustomFontFaceCSS(faces: IFontFaces[]): string {
    return faces
        .map((face) => {
            const src = face.src
                ?.map((srcElement) => {
                    let format = "";
                    if (srcElement.format) {
                        format = `format("${srcElement.format}")`;
                    }
                    if (srcElement.url) {
                        return `url("${srcElement.url}") ${format}`;
                    } else if (srcElement.local) {
                        return `local("${srcElement.local}") ${format}`;
                    }
                    return "";
                })
                .join(", ");
            const props = Object.keys(face).filter((prop) =>
                allowedFontFaceProps.includes(prop as (typeof allowedFontFaceProps)[number]),
            ) as Array<(typeof allowedFontFaceProps)[number]>;
            const body = props
                .map((prop) => {
                    let value: string;
                    if (prop === "src") {
                        value = src;
                    } else if (prop === "font-family") {
                        value = `"${face[prop]}"`;
                    } else {
                        value = face[prop];
                    }
                    return `${prop}: ${value}`;
                })
                .join(";");
            return `@font-face {${body}}`;
        })
        .join("\n");
}

const COMPOUND_TOKEN = /^--cpd-[a-z0-9-]+$/;

/**
 * Generates a style sheet to override Compound design tokens as specified in
 * the given theme.
 */
function generateCustomCompoundCSS(theme: CompoundTheme): string {
    const properties: string[] = [];
    for (const [token, value] of Object.entries(theme))
        if (COMPOUND_TOKEN.test(token)) properties.push(`${token}: ${value};`);
        else logger.warn(`'${token}' is not a valid Compound token`);
    // Insert the design token overrides into the 'custom' cascade layer as
    // documented at https://compound.element.io/?path=/docs/develop-theming--docs
    return `@layer compound.custom { :root, [class*="cpd-theme-"] { ${properties.join(" ")} } }`;
}

/**
 * Normalizes the hex colour to 8 characters (including alpha)
 * @param hexColor the hex colour to normalize
 */
function normalizeHexColour(hexColor: string): string {
    switch (hexColor.length) {
        case 4:
        case 5:
            // Short RGB or RGBA hex
            return `#${hexColor
                .slice(1)
                .split("")
                .map((c) => c + c)
                .join("")}`;
        case 7:
            // Long RGB hex
            return `${hexColor}ff`;
        default:
            return hexColor;
    }
}

function setHexAlpha(normalizedHexColor: string, alpha: number): string {
    return normalizeHexColour(normalizedHexColor).slice(0, 7) + Math.round(alpha).toString(16).padStart(2, "0");
}

function parseAlpha(normalizedHexColor: string): number {
    return parseInt(normalizedHexColor.slice(7), 16);
}

function setCustomThemeVars(customTheme: CustomTheme): void {
    const { style } = document.body;

    function setCSSColorVariable(name: string, hexColor: string, doPct = true): void {
        style.setProperty(`--${name}`, hexColor);
        const normalizedHexColor = normalizeHexColour(hexColor);
        const baseAlpha = parseAlpha(normalizedHexColor);

        if (doPct) {
            // uses #rrggbbaa to define the color with alpha values at 0%, 15% and 50% (relative to base alpha channel)
            style.setProperty(`--${name}-0pct`, setHexAlpha(normalizedHexColor, 0));
            style.setProperty(`--${name}-15pct`, setHexAlpha(normalizedHexColor, baseAlpha * 0.15));
            style.setProperty(`--${name}-50pct`, setHexAlpha(normalizedHexColor, baseAlpha * 0.5));
        }
    }

    if (customTheme.colors) {
        for (const [name, value] of Object.entries(customTheme.colors)) {
            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i += 1) {
                    setCSSColorVariable(`${name}_${i}`, value[i], false);
                }
            } else {
                setCSSColorVariable(name, value);
            }
        }
    }
    if (customTheme.fonts) {
        const { fonts } = customTheme;
        if (fonts.faces) {
            const css = generateCustomFontFaceCSS(fonts.faces);
            const style = document.createElement("style");
            style.setAttribute("title", "custom-theme-font-faces");
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }
        if (fonts.general) {
            style.setProperty("--font-family", fonts.general);
        }
        if (fonts.monospace) {
            style.setProperty("--font-family-monospace", fonts.monospace);
        }
    }
    if (customTheme.compound) {
        const css = generateCustomCompoundCSS(customTheme.compound);
        const style = document.createElement("style");
        style.setAttribute("title", "custom-theme-compound");
        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
}

export function getCustomTheme(themeName: string): CustomTheme {
    // set css variables
    const customThemes = SettingsStore.getValue("custom_themes");
    if (!customThemes) {
        throw new Error(`No custom themes set, can't set custom theme "${themeName}"`);
    }
    const customTheme = customThemes.find((t: CustomTheme) => t.name === themeName);
    if (!customTheme) {
        const knownNames = customThemes.map((t: CustomTheme) => t.name).join(", ");
        throw new Error(`Can't find custom theme "${themeName}", only know ${knownNames}`);
    }
    return customTheme;
}

/**
 * Called whenever someone changes the theme
 * Async function that returns once the theme has been set
 * (ie. the CSS has been loaded)
 *
 * @param {string} theme new theme
 */
export async function setTheme(theme?: string): Promise<void> {
    if (!theme) {
        const themeWatcher = new ThemeWatcher();
        theme = themeWatcher.getEffectiveTheme();
    }
    clearCustomTheme();
    let stylesheetName = theme;
    if (theme.startsWith("custom-")) {
        const customTheme = getCustomTheme(theme.slice(7));
        stylesheetName = customTheme.is_dark ? "dark-custom" : "light-custom";
        setCustomThemeVars(customTheme);
    }

    // look for the stylesheet elements.
    // styleElements is a map from style name to HTMLLinkElement.
    const styleElements = new Map<string, HTMLLinkElement>();
    const themes = Array.from(document.querySelectorAll<HTMLLinkElement>("[data-mx-theme]"));
    themes.forEach((theme) => {
        styleElements.set(theme.dataset.mxTheme!.toLowerCase(), theme);
    });

    if (!styleElements.has(stylesheetName)) {
        throw new Error("Unknown theme " + stylesheetName);
    }

    // disable all of them first, then enable the one we want. Chrome only
    // bothers to do an update on a true->false transition, so this ensures
    // that we get exactly one update, at the right time.
    //
    // ^ This comment was true when we used to use alternative stylesheets
    // for the CSS.  Nowadays we just set them all as disabled in index.html
    // and enable them as needed.  It might be cleaner to disable them all
    // at the same time to prevent loading two themes simultaneously and
    // having them interact badly... but this causes a flash of unstyled app
    // which is even uglier.  So we don't.

    const styleSheet = styleElements.get(stylesheetName)!;
    styleSheet.disabled = false;

    /**
     * Adds the Compound theme class to the top-most element in the document
     * This will automatically refresh the colour scales based on the OS or user
     * preferences
     */
    document.body.classList.remove("cpd-theme-light", "cpd-theme-dark", "cpd-theme-light-hc", "cpd-theme-dark-hc");

    let compoundThemeClassName = `cpd-theme-` + (stylesheetName.includes("light") ? "light" : "dark");
    // Always respect user OS preference!
    if (isHighContrastTheme(theme) || window.matchMedia("(prefers-contrast: more)").matches) {
        compoundThemeClassName += "-hc";
    }

    document.body.classList.add(compoundThemeClassName);

    return new Promise((resolve, reject) => {
        const switchTheme = function (): void {
            // we re-enable our theme here just in case we raced with another
            // theme set request as per https://github.com/vector-im/element-web/issues/5601.
            // We could alternatively lock or similar to stop the race, but
            // this is probably good enough for now.
            styleSheet.disabled = false;
            styleElements.forEach((a) => {
                if (a == styleSheet) return;
                a.disabled = true;
            });
            const bodyStyles = global.getComputedStyle(document.body);
            // disable meta theme color, done statically in index.html
            // if (bodyStyles.backgroundColor) {
            //     const metaElement = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!;
            //     metaElement.content = bodyStyles.backgroundColor;
            // }
            resolve();
        };

        const isStyleSheetLoaded = (): boolean =>
            Boolean([...document.styleSheets].find((_styleSheet) => _styleSheet?.href === styleSheet.href));

        function waitForStyleSheetLoading(): void {
            // turns out that Firefox preloads the CSS for link elements with
            // the disabled attribute, but Chrome doesn't.
            if (isStyleSheetLoaded()) {
                switchTheme();
                return;
            }

            let counter = 0;

            // In case of theme toggling (white => black => white)
            // Chrome doesn't fire the `load` event when the white theme is selected the second times
            const intervalId = window.setInterval(() => {
                if (isStyleSheetLoaded()) {
                    clearInterval(intervalId);
                    styleSheet.onload = null;
                    styleSheet.onerror = null;
                    switchTheme();
                }

                // Avoid to be stuck in an endless loop if there is an issue in the stylesheet loading
                counter++;
                if (counter === 10) {
                    clearInterval(intervalId);
                    reject();
                }
            }, 200);

            styleSheet.onload = () => {
                clearInterval(intervalId);
                switchTheme();
            };

            styleSheet.onerror = (e) => {
                clearInterval(intervalId);
                reject(e);
            };
        }

        waitForStyleSheetLoading();
    });
}
