const { readFileSync } = require("jsonfile");

if (process.argv.length < 4) {
	console.log("Usar: node ./index.js [GLC] [Tamanho máximo]");
	process.exit();
}

var glc;
const N = parseInt(process.argv[3]);

try {
	glc = readFileSync(process.argv[2]).glc;
} catch (error) {
	console.error("Erro ao importar arquivo JSON da GLC.", error);
	process.exit();
}

console.log(glc, N);
