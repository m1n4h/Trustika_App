/**
 * Metro configuration for React Native
 * Uses Expo's default metro config and adds common fixes.
 *
 * - Adds `cjs` to the resolver `sourceExts` so packages that publish CommonJS can be handled.
 * - Keeps the default Expo metro configuration so it remains compatible.
 *
 * After adding this file, restart Metro with cache clear:
 *   npx expo start -c
 */

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Ensure 'cjs' is supported by the resolver (some packages use .cjs)
config.resolver.sourceExts = Array.from(new Set([...(config.resolver.sourceExts || []), "cjs"]));

// Add additional watch folders if you're working in a monorepo (uncomment and adjust if needed)
// config.watchFolders = config.watchFolders || [];
// config.watchFolders.push(path.resolve(projectRoot, '..'));

module.exports = config;
