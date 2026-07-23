const YTDlpWrap = require("yt-dlp-wrap").default;

async function install() {

    try {

        console.log("⬇️ Baixando yt-dlp...");

        await YTDlpWrap.downloadFromGithub();

        console.log("✅ yt-dlp pronto!");

    } catch (error) {

        console.log(
            "❌ Erro baixando yt-dlp:",
            error.message
        );

    }

}

install();