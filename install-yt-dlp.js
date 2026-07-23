const { default: YTDlpWrap } = require("yt-dlp-wrap");
const path = require("path");

(async () => {
    try {
        const output = path.join(__dirname, "yt-dlp");

        await YTDlpWrap.downloadBinary(output);

        console.log("✅ yt-dlp instalado!");
    } catch (err) {
        console.error("❌ Erro ao instalar yt-dlp:", err);
        process.exit(1);
    }
})();