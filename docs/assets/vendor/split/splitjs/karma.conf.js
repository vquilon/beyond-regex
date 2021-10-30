module.exports = config => {
    config.set({
        customLaunchers: {
            sl_firefox_latest: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'Windows 10',
                version: 'latest',
            },
            sl_chrome_latest: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Windows 10',
                version: 'latest',
            },
            sl_safari: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'macOS 10.15',
                version: 'latest',
            },
            sl_edge: {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
                platform: 'Windows 10',
                version: 'latest',
            },
            sl_ie_11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 10',
                version: 'latest',
            },
            sl_ie_10: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 7',
                version: '10.0',
            },
        },
        frameworks: ['jasmine'],
        browsers: ['FirefoxHeadless', 'ChromeHeadless'],
        singleRun: true,
        files: ['dist/split.js', 'test/split.spec.js'],
    })
}
