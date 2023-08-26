/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://slazurin.github.io',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: [
        '/en/farm/*',
        '/zh-TW/farm/*',
        '/api/*',
    ],
    
};
