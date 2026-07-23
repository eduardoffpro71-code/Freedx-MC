const YTDlpWrap = require("yt-dlp-wrap").default;

async function install() {

    try {

        console.log("⬇️ Baixando yt-dlp standalone...");

        await YTDlpWrap.downloadFromGithub(
            "yt-dlp"
        );

        console.log("✅ yt-dlp standalone pronto!");

    } catch (error) {

        console.log(
            "❌ Erro yt-dlp:",
            error.message
        );

    }

}

install();