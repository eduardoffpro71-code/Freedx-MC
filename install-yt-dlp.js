const YTDlpWrap = require("yt-dlp-wrap").default;

const path = require("path");

const ytDlp = new YTDlpWrap();

ytDlp.downloadFromGithub(
    path.join(__dirname, "yt-dlp")
)
.then(() => {
    console.log("✅ yt-dlp instalado!");
})
.catch(err => {
    console.log("❌ Erro yt-dlp:", err);
});