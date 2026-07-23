const { execSync } = require("child_process");

try {

    console.log("⬇️ Instalando yt-dlp...");

    execSync(
        "pip install yt-dlp",
        {
            stdio: "inherit"
        }
    );

    console.log("✅ yt-dlp instalado!");

} catch (error) {

    console.log(
        "❌ Erro instalando yt-dlp:",
        error.message
    );

}