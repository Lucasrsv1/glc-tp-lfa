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

const result = new Set();

/**
 * @param {string} palavra
 * @returns {number}
 */
function realTamanho (palavra) {
	return palavra.split("").filter(c => glc[0].indexOf(c) === -1).length;
}

/**
 * @param {string} palavra
 * @returns {string}
 */
function obtemProximoEstado (palavra) {
	return palavra.split("").find(c => glc[0].indexOf(c) >= 0);
}

/**
 * @param {string} palavra
 * @param {string} estadoAtual
 */
function processaEstado (palavra, estadoAtual) {
	const idx = palavra.indexOf(estadoAtual)
	let regrasEstadoAtual = glc[2].filter(r => r[0] == estadoAtual).map(r => r[1]);

	for (let regra of regrasEstadoAtual) {
		if (realTamanho(regra) > N) continue;

		const conteudo = regra != "#" || realTamanho(palavra) === 0 ? regra : "";
		const palavraProcessada = palavra.substr(0, idx) + conteudo + palavra.substr(idx + 1);
		if (realTamanho(palavraProcessada) > N) continue;

		const proxEstado = obtemProximoEstado(palavraProcessada);
		if (!proxEstado)
			result.add(palavraProcessada);
		else
			processaEstado(palavraProcessada.replace(/#/g, ""), proxEstado);
	}
}

let palavra = glc[3];
processaEstado(palavra, glc[3]);

for (const w of result)
	console.log(w);
