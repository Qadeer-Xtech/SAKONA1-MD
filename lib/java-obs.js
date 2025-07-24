// lib/java-obs.js

const JavaScriptObfuscator = require('javascript-obfuscator');

// Website se liye gaye obfuscation levels aur unki settings
const levels = {
    'basic': {
        label: 'BASIC',
        options: { compact: true, controlFlowFlattening: false, deadCodeInjection: false, stringArray: false, transformObjectKeys: false }
    },
    'medium': {
        label: 'MEDIUM',
        options: { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5, deadCodeInjection: true, deadCodeInjectionThreshold: 0.2, stringArray: true, stringArrayThreshold: 0.7, transformObjectKeys: true, unicodeEscapeSequence: false }
    },
    'advanced': {
        label: 'ADVANCED',
        options: { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 1, deadCodeInjection: true, deadCodeInjectionThreshold: 1, stringArray: true, stringArrayThreshold: 1, stringArrayEncoding: ['base64'], stringArrayWrappersCount: 4, transformObjectKeys: true, renameGlobals: true, identifierNamesGenerator: 'hexadecimal', splitStrings: true, selfDefending: true }
    },
    'hard': {
        label: 'HARD-ADV',
        options: { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 1, deadCodeInjection: true, deadCodeInjectionThreshold: 1, disableConsoleOutput: true, renameGlobals: true, selfDefending: true, stringArray: true, stringArrayEncoding: ['rc4'], stringArrayThreshold: 1, stringArrayWrappersCount: 5, stringArrayWrappersChained: true, stringArrayWrappersType: 'function', splitStrings: true, splitStringsChunkLength: 2, transformObjectKeys: true, identifierNamesGenerator: 'hexadecimal' }
    }
};

/**
 * Code ko obfuscate karne wala main function
 * @param {string} code - Woh JavaScript code jisko obfuscate karna hai.
 * @param {string} level - Obfuscation ka level ('basic', 'medium', 'advanced', 'hard').
 * @returns {{success: boolean, result: string, error?: string}} - Obfuscation ka result
 */
function obfuscateCode(code, level) {
    try {
        if (!levels[level]) {
            return { success: false, error: 'Invalid obfuscation level provided.' };
        }

        const selectedLevel = levels[level];
        const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, selectedLevel.options);
        const obfuscatedCode = obfuscatedResult.getObfuscatedCode();

        if (!obfuscatedCode) {
            return { success: false, error: 'Failed to obfuscate. The code might be empty or invalid.' };
        }
        
        const responseMessage = `// Obfuscated with [${selectedLevel.label}] settings by Qadeer-Xtech\n\n\`\`\`${obfuscatedCode}\`\`\``;
        return { success: true, result: responseMessage };

    } catch (e) {
        console.error(`Obfuscation Error:`, e);
        return { success: false, error: `An error occurred: ${e.message}` };
    }
}

// Is function ko doosri files mein use karne ke liye export karein
module.exports = { obfuscateCode };
