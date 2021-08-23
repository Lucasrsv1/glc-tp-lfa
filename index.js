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

/**
 * @type {Set<string>} Conjunto de palavras da GLC
 */
const result = new Set();

/**
 * Retorna o tamanho real da palavra contando apenas os símbolos e ignorando as variáveis
 * @param {string} palavra palavra alvo
 * @returns {number}
 */
function tamanhoReal (palavra) {
	return palavra.split("").filter(c => glc[0].indexOf(c) === -1).length;
}

/**
 * Identifica a primeira variável da palavra, caso exista
 * @param {string} palavra palavra alvo
 * @returns {string}
 */
function obtemProximoEstado (palavra) {
	return palavra.split("").find(c => glc[0].indexOf(c) >= 0);
}

/**
 * Processa o estado atual, dada uma palavra
 * @param {string} palavra palavra formada até o momento contendo símbolos e variáveis
 * @param {string} estadoAtual estado/variável da palavra a ser processado
 */
function processaEstado (palavra, estadoAtual) {
	// Localiza a posição da variável do estado atual na palavra
	const idx = palavra.indexOf(estadoAtual)

	// Identifica o conjunto de regras da GLC para o estado/variável atual
	let regrasEstadoAtual = glc[2].filter(r => r[0] == estadoAtual).map(r => r[1]);

	for (let regra of regrasEstadoAtual) {
		// Ignora regras com mais símbolos do que o tamanho máximo
		if (tamanhoReal(regra) > N) continue;

		// Obtém o conteúdo da regra tratando o caso lambda
		const conteudo = regra != "#" || tamanhoReal(palavra) === 0 ? regra : "";

		// Substitui na palavra a variável pelo seu conteúdo seguindo a regra atual
		const palavraProcessada = palavra.substr(0, idx) + conteudo + palavra.substr(idx + 1);

		// Ignora palavra com mais símbolos do que o tamanho máximo
		if (tamanhoReal(palavraProcessada) > N) continue;

		// Identifica a próxima variável contida na palavra
		const proxEstado = obtemProximoEstado(palavraProcessada);

		// Se não há uma próxima variável
		if (!proxEstado) {
			// Adiciona a palavra resultante ao conjunto de palavras da GLC
			result.add(palavraProcessada);
		} else {
			// Do contrário, processa a palavra resultante a partir do
			// estado da primeira variável identificada na palavra
			processaEstado(palavraProcessada.replace(/#/g, ""), proxEstado);
		}
	}
}

// Começa a gerar uma palavra a partir do estado/variável inicial
let palavra = glc[3];
processaEstado(palavra, glc[3]);

// Imprime todas as palavras da GLC com tamanho até N
for (const w of result)
	console.log(w);
